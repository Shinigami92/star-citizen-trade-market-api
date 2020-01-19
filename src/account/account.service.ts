import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { QueryResult } from 'pg';
import * as postgresArray from 'postgres-array';
import { client } from '../database.service';
import { Account, AuthToken, Role } from '../graphql.schema';
import { transporter } from '../mail.service';
import { CreateAccountDto } from './dto/create-account.dto';

export const TABLENAME: string = 'account';

@Injectable()
export class AccountService {
	private readonly logger: Logger = new Logger(AccountService.name);

	private readonly jwtService: JwtService = new JwtService({
		secret: process.env.JWT_SECRET_KEY,
		signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
	});

	private readonly PASSWORD_CHARS: string[] = [...'abcdefhjkmnpqrstuvwxABCDEFHJKMNPQRSTUVWX2345789'];

	public async signUp({ username, handle, email }: CreateAccountDto): Promise<Account> {
		const salt: string = await genSalt();
		const generatedPassword: string = [...Array(Math.floor(Math.random() * 9) + 12)]
			.map(
				// tslint:disable-next-line:no-bitwise
				() => this.PASSWORD_CHARS[(Math.random() * this.PASSWORD_CHARS.length) | 0]
			)
			.join('');
		const encryptedPassword: string = await hash(generatedPassword, salt);
		let result: QueryResult;
		try {
			result = await client.query(
				`INSERT INTO ${TABLENAME}(username, handle, email, password)` +
					' VALUES ($1::text, $2::text, $3::text, $4::text) RETURNING *',
				[username, handle, email, encryptedPassword]
			);
		} catch (error) {
			this.logger.error(error);
			switch (error.constraint) {
				case 'account_username_key':
					throw new ConflictException(`Username ${username} is already in use`);
				case 'account_handle_key':
					throw new ConflictException(`Star Citizen Handle ${handle} is already taken by another user`);
				case 'account_email_key':
					throw new ConflictException(`Email ${email} is already in use`);
			}
			throw new InternalServerErrorException();
		}

		transporter.sendMail({
			to: email,
			subject: 'Registration in Star Citizen Trademarket',
			text: `Star Citizen Trademarket\nUsername: ${username}\nPassword: ${generatedPassword}`
		});
		// TODO: remove account if email cant be delivered

		const created: Account = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async signIn(username: string, password: string): Promise<AuthToken> {
		const account: Account | undefined = await this.findOneByUsername(username);
		// TODO: throw other exception
		if (account === undefined) {
			throw new UnauthorizedException();
		}
		const match: boolean = await compare(password, (account as any).password);
		if (!match) {
			throw new UnauthorizedException();
		}

		const token: string = this.jwtService.sign({ username: account.username });

		return {
			id: account.id,
			username: account.username,
			roles: this.transformRoles(account)!.roles,
			token
		};
	}

	public async findAll(): Promise<Account[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows.map((row) => this.transformRoles(row)!);
	}

	public async findOneById(id: string): Promise<Account | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return this.transformRoles(result.rows[0]);
	}

	public async findOneByUsername(username: string): Promise<Account | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE username = $1::text`, [
			username
		]);
		return this.transformRoles(result.rows[0]);
	}

	private transformRoles(account?: Account): Account | undefined {
		if (account === undefined) {
			return undefined;
		}
		const roles: any = account.roles;
		if (typeof roles === 'string') {
			account.roles = postgresArray.parse(roles) as Role[];
		}
		return account;
	}
}
