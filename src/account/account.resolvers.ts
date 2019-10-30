import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentAuthUser } from '../auth/current-user';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Account, AuthToken, Organization, Role } from '../graphql.schema';
import { OrganizationService } from '../organization/organization.service';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Account')
export class AccountResolvers {
	constructor(
		private readonly accountService: AccountService,
		private readonly organizationService: OrganizationService
	) {}

	@Query()
	public async accounts(): Promise<Account[]> {
		return await this.accountService.findAll();
	}

	@Query()
	public async account(@Args('id') id: string): Promise<Account | undefined> {
		return await this.accountService.findOneById(id);
	}

	@Mutation()
	public async signUp(@Args('input') args: CreateAccountDto): Promise<Account> {
		const created: Account = await this.accountService.signUp(args);
		pubSub.publish('accountSignedUp', { accountSignedUp: created });
		return created;
	}

	@Query()
	public async signIn(@Args('username') username: string, @Args('password') password: string): Promise<AuthToken> {
		return await this.accountService.signIn(username, password);
	}

	@Query()
	@UseGuards(GraphqlAuthGuard)
	public async me(@CurrentUser() currentUser: CurrentAuthUser): Promise<Account> {
		return (await this.accountService.findOneById(currentUser.id))!;
	}

	@Subscription()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USERADMIN, Role.ADMIN)
	public accountSignedUp(): AsyncIterator<{}> {
		return pubSub.asyncIterator('accountSignedUp');
	}

	@ResolveProperty()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.USERADMIN, Role.ADMIN)
	public email(@Parent() parent: Account, @CurrentUser() currentUser: CurrentAuthUser): string {
		if (parent.id === currentUser.id) {
			return parent.email!;
		}
		if (currentUser.hasAnyRole([Role.USERADMIN, Role.ADMIN])) {
			return parent.email!;
		}
		throw new UnauthorizedException();
	}

	@ResolveProperty()
	public async mainOrganization(@Parent() parent: Account): Promise<Organization | null> {
		if (parent.mainOrganizationId !== undefined) {
			return (await this.organizationService.findOneById(parent.mainOrganizationId))!;
		}
		return null;
	}
}
