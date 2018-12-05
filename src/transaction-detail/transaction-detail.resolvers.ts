import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { TransactionDetail, TransactionDetailType } from 'src/graphql.schema';
import { CreateBoughtTransactionDetailDto } from './dto/create-bought-transaction-detail.dto';
import { CreateLostBasedOnTransactionDetailDto } from './dto/create-lost-based-on-transaction-detail.dto';
import { CreateLostTransactionDetailDto } from './dto/create-lost-transaction-detail.dto';
import { CreateSoldTransactionDetailDto } from './dto/create-sold-transaction-detail.dto';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';
import { TransactionDetailService } from './transaction-detail.service';

const pubSub: PubSub = new PubSub();

@Resolver('TransactionDetail')
export class TransactionDetailResolvers {
	constructor(private readonly transactionDetailService: TransactionDetailService) {}

	@Query('transactionDetails')
	public async transactionDetails(): Promise<TransactionDetail[]> {
		return await this.transactionDetailService.findAll();
	}

	@Query('transactionDetail')
	public async findOneById(@Args('id') id: string): Promise<TransactionDetail | undefined> {
		return await this.transactionDetailService.findOneById(id);
	}

	@Mutation('createTransactionDetail')
	@UseGuards(GraphqlAuthGuard)
	public async create(
		@Args('createTransactionDetailInput') args: CreateTransactionDetailDto
	): Promise<TransactionDetail> {
		const createdTransactionDetail: TransactionDetail = await this.transactionDetailService.create(args);
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: createdTransactionDetail });
		return createdTransactionDetail;
	}

	@Mutation('createBoughtTransactionDetail')
	@UseGuards(GraphqlAuthGuard)
	public async createBoughtTransactionDetail(
		@Args('createBoughtTransactionDetailInput') args: CreateBoughtTransactionDetailDto
	): Promise<TransactionDetail> {
		const createdTransactionDetail: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.BOUGHT
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: createdTransactionDetail });
		return createdTransactionDetail;
	}

	@Mutation('createSoldTransactionDetail')
	@UseGuards(GraphqlAuthGuard)
	public async createSoldTransactionDetail(
		@Args('createSoldTransactionDetailInput') args: CreateSoldTransactionDetailDto
	): Promise<TransactionDetail> {
		const createdTransactionDetail: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.SOLD
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: createdTransactionDetail });
		return createdTransactionDetail;
	}

	@Mutation('createLostTransactionDetail')
	@UseGuards(GraphqlAuthGuard)
	public async createLostTransactionDetail(
		@Args('createLostTransactionDetailInput') args: CreateLostTransactionDetailDto
	): Promise<TransactionDetail> {
		const createdTransactionDetail: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.LOST
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: createdTransactionDetail });
		return createdTransactionDetail;
	}

	@Mutation('createLostBasedOnTransactionDetail')
	@UseGuards(GraphqlAuthGuard)
	public async createLostBasedOnTransactionDetail(
		@Args('createLostBasedOnTransactionDetailInput') args: CreateLostBasedOnTransactionDetailDto
	): Promise<TransactionDetail> {
		const createdTransactionDetail: TransactionDetail = await this.transactionDetailService.createLostBasedOnTransaction(
			args
		);
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: createdTransactionDetail });
		return createdTransactionDetail;
	}

	@Subscription('transactionDetailCreated')
	public transactionDetailCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('transactionDetailCreated')
		};
	}
}
