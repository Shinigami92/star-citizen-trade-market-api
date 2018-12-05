import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationMemberResolvers } from './organization-member.resolvers';
import { OrganizationMemberService } from './organization-member.service';

@Module({
	imports: [OrganizationModule, AccountModule],
	providers: [OrganizationMemberService, OrganizationMemberResolvers, OrganizationService, AccountService]
})
export class OrganizationMemberModule {}
