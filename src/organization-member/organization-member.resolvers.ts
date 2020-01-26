import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AccountService } from '../account/account.service';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Account, Organization, OrganizationMember, Role } from '../graphql.schema';
import { OrganizationService } from '../organization/organization.service';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { OrganizationMemberService } from './organization-member.service';

const pubSub: PubSub = new PubSub();

@Resolver('OrganizationMember')
export class OrganizationMemberResolvers {
  public constructor(
    private readonly organizationMemberService: OrganizationMemberService,
    private readonly organizationService: OrganizationService,
    private readonly accountService: AccountService
  ) {}

  @Query()
  public async organizationMembers(): Promise<OrganizationMember[]> {
    return await this.organizationMemberService.findAll();
  }

  @Query()
  public async organizationMember(
    @Args('organizationId') organizationId: string,
    @Args('accountId') accountId: string
  ): Promise<OrganizationMember | undefined> {
    return await this.organizationMemberService.findOneByOrganizationIdAndAccountId(organizationId, accountId);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
  public async joinOrganization(@Args('joinOrganizationInput') args: JoinOrganizationDto): Promise<OrganizationMember> {
    const joined: OrganizationMember = await this.organizationMemberService.join(args);
    pubSub.publish('organizationMemberCreated', { organizationMemberCreated: joined });
    return joined;
  }

  @Subscription()
  public organizationMemberCreated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('organizationMemberCreated');
  }

  @ResolveProperty()
  public async organization(@Parent() organizationMember: OrganizationMember): Promise<Organization> {
    const organization: Organization | undefined = await this.organizationService.findOneById(
      organizationMember.organizationId
    );
    if (!organization) {
      throw new NotFoundException(`Organization with id ${organizationMember.organizationId} not found`);
    }
    return organization;
  }

  @ResolveProperty()
  public async account(@Parent() organizationMember: OrganizationMember): Promise<Account> {
    const account: Account | undefined = await this.accountService.findOneById(organizationMember.accountId);
    if (!account) {
      throw new NotFoundException(`Account with id ${organizationMember.accountId} not found`);
    }
    return account;
  }
}
