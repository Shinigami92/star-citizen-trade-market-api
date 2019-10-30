import { OrganizationModule } from '@/organization/organization.module';
import { OrganizationService } from '@/organization/organization.service';
import { Module } from '@nestjs/common';
import { AccountResolvers } from './account.resolvers';
import { AccountService } from './account.service';

@Module({
	imports: [OrganizationModule],
	providers: [AccountService, AccountResolvers, OrganizationService]
})
export class AccountModule {}
