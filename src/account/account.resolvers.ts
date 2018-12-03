import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/auth.guard';
import { Account, Organization, Role } from 'src/graphql.schema';
import { OrganizationService } from 'src/organization/organization.service';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Account')
export class AccountResolvers {
	constructor(
		private readonly accountService: AccountService,
		private readonly organizationService: OrganizationService
	) {}

	@Query('accounts')
	public async accounts(): Promise<Account[]> {
		return await this.accountService.findAll();
	}

	@Query('account')
	public async findOneById(@Args('id') id: string): Promise<Account | undefined> {
		return await this.accountService.findOneById(id);
	}

	@Mutation('signUp')
	@UseGuards(AuthGuard)
	public async signUp(@Args('createAccountInput') args: CreateAccountDto): Promise<Account> {
		const createdAccount: Account = await this.accountService.signUp(args);
		pubSub.publish('accountSignedUp', { accountSignedUp: createdAccount });
		return createdAccount;
	}

	@Subscription('accountSignedUp')
	public accountSignedUp(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('accountSignedUp')
		};
	}

	@ResolveProperty('email')
	@UseGuards(AuthGuard)
	public email(@Parent() account: Account, @Context('user') currentUser: Account): string | undefined {
		if (account.id === currentUser.id) {
			return account.email;
		}
		if (currentUser.roles!.find((r: Role) => r === Role.USERADMIN || r === Role.ADMIN) !== undefined) {
			return account.email;
		}
		return undefined;
	}

	@ResolveProperty('mainOrganization')
	public async location(@Parent() account: Account): Promise<Organization | null> {
		if (account.mainOrganizationId !== undefined) {
			return (await this.organizationService.findOneById(account.mainOrganizationId))!;
		}
		return null;
	}
}
