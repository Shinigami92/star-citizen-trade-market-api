import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Transaction } from 'src/graphql.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

const pubSub: PubSub = new PubSub();

@Resolver('Transaction')
export class TransactionResolvers {
	constructor(private readonly transactionService: TransactionService) {}

	@Query('transactions')
	public async transactions(): Promise<Transaction[]> {
		return await this.transactionService.findAll();
	}

	@Query('transaction')
	public async findOneById(@Args('id') id: string): Promise<Transaction | undefined> {
		return await this.transactionService.findOneById(id);
	}

	@Mutation('createTransaction')
	@UseGuards(GraphqlAuthGuard)
	public async create(@Args('createTransactionInput') args: CreateTransactionDto): Promise<Transaction> {
		const createdTransaction: Transaction = await this.transactionService.create(args);
		pubSub.publish('transactionCreated', { transactionCreated: createdTransaction });
		return createdTransaction;
	}

	@Subscription('transactionCreated')
	public transactionCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('transactionCreated')
		};
	}
}
