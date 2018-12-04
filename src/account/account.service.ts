import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { QueryResult } from 'pg';
import * as postgresArray from 'postgres-array';
import { client } from 'src/database.service';
import { transporter } from 'src/mail.service';
import { Account, Role } from '../graphql.schema';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
	private readonly PASSWORD_CHARS: string[] = [...'abcdefhjkmnpqrstuvwxABCDEFHJKMNPQRSTUVWX2345789'];

	public async signUp(account: CreateAccountDto): Promise<Account> {
		const salt: string = await genSalt();
		const generatedPassword: string = [...Array(Math.floor(Math.random() * 9) + 12)]
			.map(
				// tslint:disable-next-line:no-bitwise
				(_: unknown) => this.PASSWORD_CHARS[(Math.random() * this.PASSWORD_CHARS.length) | 0]
			)
			.join('');

		transporter.sendMail({
			to: account.email,
			subject: 'Registration on Star Citizen Trademarked',
			text: `Star Citizen Trademarked\nUsername: ${account.username}\nPassword: ${generatedPassword}`
		});

		const encryptedPassword: string = await hash(generatedPassword, salt);
		const result: QueryResult = await client.query(
			'INSERT INTO account(username, handle, email, password) VALUES ($1::text, $2::text, $3::text, $4::text) RETURNING *',
			[account.username, account.handle, account.email, encryptedPassword]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Account[]> {
		const result: QueryResult = await client.query('SELECT * FROM account');
		return result.rows.map((row: any) => this.transformRoles(row)!);
	}

	public async findOneById(id: string): Promise<Account | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM account WHERE id = $1::uuid', [id]);
		return this.transformRoles(result.rows[0]);
	}

	public async findOneByUsername(username: string): Promise<Account | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM account WHERE username = $1::text', [username]);
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
