import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AccountService } from 'src/account/account.service';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Account, Organization, OrganizationMember, Role } from 'src/graphql.schema';
import { OrganizationService } from 'src/organization/organization.service';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { OrganizationMemberService } from './organization-member.service';

const pubSub: PubSub = new PubSub();

@Resolver('OrganizationMember')
export class OrganizationMemberResolvers {
	constructor(
		private readonly organizationMemberService: OrganizationMemberService,
		private readonly organizationService: OrganizationService,
		private readonly accountService: AccountService
	) {}

	@Query('organizationMembers')
	public async organizationMembers(): Promise<OrganizationMember[]> {
		return await this.organizationMemberService.findAll();
	}

	@Query('organizationMember')
	public async findOneByOrganizationIdAndAccountId(
		@Args('organizationId') organizationId: string,
		@Args('accountId') accountId: string
	): Promise<OrganizationMember | undefined> {
		return await this.organizationMemberService.findOneByOrganizationIdAndAccountId(organizationId, accountId);
	}

	@Mutation('joinOrganization')
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async join(@Args('joinOrganizationInput') args: JoinOrganizationDto): Promise<OrganizationMember> {
		const joinedOrganization: OrganizationMember = await this.organizationMemberService.join(args);
		pubSub.publish('organizationMemberCreated', { organizationMemberCreated: joinedOrganization });
		return joinedOrganization;
	}

	@Subscription('organizationMemberCreated')
	public organizationMemberCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('organizationMemberCreated')
		};
	}

	@ResolveProperty('organization')
	public async organization(@Parent() organizationMember: OrganizationMember): Promise<Organization> {
		return (await this.organizationService.findOneById(organizationMember.organizationId))!;
	}

	@ResolveProperty('account')
	public async account(@Parent() organizationMember: OrganizationMember): Promise<Account> {
		return (await this.accountService.findOneById(organizationMember.accountId))!;
	}
}
