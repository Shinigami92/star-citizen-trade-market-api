import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/graphql.schema';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
	constructor(private readonly accountService: AccountService) {}

	public async validateUser({ username }: JwtPayload): Promise<Account | undefined> {
		return await this.accountService.findOneByUsername(username);
	}
}
