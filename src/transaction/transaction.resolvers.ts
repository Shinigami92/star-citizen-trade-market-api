import { CurrentAuthUser } from '@/auth/current-user';
import { GraphqlAuthGuard } from '@/auth/graphql-auth.guard';
import { HasAnyRole } from '@/auth/has-any-role.decorator';
import { RoleGuard } from '@/auth/role.guard';
import { CurrentUser } from '@/auth/user.decorator';
import { Role, Transaction } from '@/graphql.schema';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

const pubSub: PubSub = new PubSub();

@Resolver('Transaction')
export class TransactionResolvers {
	constructor(private readonly transactionService: TransactionService) {}

	@Query()
	@UseGuards(GraphqlAuthGuard)
	public async transactions(): Promise<Transaction[]> {
		return await this.transactionService.findAll();
	}

	@Query()
	@UseGuards(GraphqlAuthGuard)
	public async transaction(@Args('id') id: string): Promise<Transaction | undefined> {
		return await this.transactionService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createTransaction(
		@Args('input') args: CreateTransactionDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<Transaction> {
		const created: Transaction = await this.transactionService.create({
			...args,
			accountId: currentUser.hasRole(Role.ADMIN) && args.accountId !== undefined ? args.accountId : currentUser.id
		});
		pubSub.publish('transactionCreated', { transactionCreated: created });
		return created;
	}

	@Subscription()
	@UseGuards(GraphqlAuthGuard)
	public transactionCreated(): AsyncIterator<{}> {
		return pubSub.asyncIterator('transactionCreated');
	}
}
