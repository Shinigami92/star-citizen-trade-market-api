import { Module } from '@nestjs/common';
import { OrganizationModule } from 'src/organization/organization.module';
import { OrganizationService } from 'src/organization/organization.service';
import { AccountResolvers } from './account.resolvers';
import { AccountService } from './account.service';

@Module({
	imports: [OrganizationModule],
	providers: [AccountService, AccountResolvers, OrganizationService]
})
export class AccountModule {}
