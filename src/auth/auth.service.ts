import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/graphql.schema';

@Injectable()
export class AuthService {
	constructor(private readonly accountService: AccountService) {}

	public async validateUser(token: string): Promise<Account | undefined> {
		const decodedToken: string = Buffer.from(token, 'base64').toString('utf-8');
		const [username, password] = decodedToken.split(':');
		const user: Account | undefined = await this.accountService.findOneByUsername(username);
		if (user === undefined) {
			return undefined;
		}
		const isPasswordMatch: boolean = await compare(password, ((user as unknown) as { password: string }).password);
		if (isPasswordMatch) {
			return user;
		}
		return undefined;
	}
}
