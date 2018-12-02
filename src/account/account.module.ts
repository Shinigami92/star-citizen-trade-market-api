import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
	providers: [AccountService]
})
export class AccountModule {}
