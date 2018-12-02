import { Module } from '@nestjs/common';
import { AccountResolvers } from './account.resolvers';
import { AccountService } from './account.service';

@Module({
	providers: [AccountService, AccountResolvers]
})
export class AccountModule {}
