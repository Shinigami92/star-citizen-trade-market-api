import { AccountModule } from '@/account/account.module';
import { AccountService } from '@/account/account.service';
import { OrganizationModule } from '@/organization/organization.module';
import { OrganizationService } from '@/organization/organization.service';
import { Module } from '@nestjs/common';
import { OrganizationMemberResolvers } from './organization-member.resolvers';
import { OrganizationMemberService } from './organization-member.service';

@Module({
	imports: [OrganizationModule, AccountModule],
	providers: [OrganizationMemberService, OrganizationMemberResolvers, OrganizationService, AccountService]
})
export class OrganizationMemberModule {}
