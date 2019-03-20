import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentAuthUser } from 'src/auth/current-user';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { Role, Transaction, TransactionDetail, TransactionDetailType } from 'src/graphql.schema';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateBoughtTransactionDetailDto } from './dto/create-bought-transaction-detail.dto';
import { CreateLostBasedOnTransactionDetailDto } from './dto/create-lost-based-on-transaction-detail.dto';
import { CreateLostTransactionDetailDto } from './dto/create-lost-transaction-detail.dto';
import { CreateSoldTransactionDetailDto } from './dto/create-sold-transaction-detail.dto';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';
import { TransactionDetailService } from './transaction-detail.service';

const pubSub: PubSub = new PubSub();

@Resolver('TransactionDetail')
export class TransactionDetailResolvers {
	constructor(
		private readonly transactionDetailService: TransactionDetailService,
		private readonly transactionService: TransactionService
	) {}

	@Query()
	@UseGuards(GraphqlAuthGuard)
	public async transactionDetails(): Promise<TransactionDetail[]> {
		return await this.transactionDetailService.findAll();
	}

	@Query()
	@UseGuards(GraphqlAuthGuard)
	public async transactionDetail(@Args('id') id: string): Promise<TransactionDetail | undefined> {
		return await this.transactionDetailService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createTransactionDetail(
		@Args('input') args: CreateTransactionDetailDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<TransactionDetail> {
		if (!currentUser.hasRole(Role.ADMIN)) {
			const transaction: Transaction | undefined = await this.transactionService.findOneById(args.transactionId);
			if (transaction === undefined) {
				throw new BadRequestException(`No transaction with id ${args.transactionId} found`);
			} else if (transaction.accountId !== currentUser.id) {
				throw new BadRequestException('You can not post transaction details for another account');
			}
		}
		const created: TransactionDetail = await this.transactionDetailService.create(args);
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createBoughtTransactionDetail(
		@Args('input') args: CreateBoughtTransactionDetailDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<TransactionDetail> {
		if (!currentUser.hasRole(Role.ADMIN)) {
			const transaction: Transaction | undefined = await this.transactionService.findOneById(args.transactionId);
			if (transaction === undefined) {
				throw new BadRequestException(`No transaction with id ${args.transactionId} found`);
			} else if (transaction.accountId !== currentUser.id) {
				throw new BadRequestException('You can not post transaction details for another account');
			}
		}
		const created: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.BOUGHT
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createSoldTransactionDetail(
		@Args('input') args: CreateSoldTransactionDetailDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<TransactionDetail> {
		if (!currentUser.hasRole(Role.ADMIN)) {
			const transaction: Transaction | undefined = await this.transactionService.findOneById(args.transactionId);
			if (transaction === undefined) {
				throw new BadRequestException(`No transaction with id ${args.transactionId} found`);
			} else if (transaction.accountId !== currentUser.id) {
				throw new BadRequestException('You can not post transaction details for another account');
			}
		}
		const created: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.SOLD
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createLostTransactionDetail(
		@Args('input') args: CreateLostTransactionDetailDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<TransactionDetail> {
		if (!currentUser.hasRole(Role.ADMIN)) {
			const transaction: Transaction | undefined = await this.transactionService.findOneById(args.transactionId);
			if (transaction === undefined) {
				throw new BadRequestException(`No transaction with id ${args.transactionId} found`);
			} else if (transaction.accountId !== currentUser.id) {
				throw new BadRequestException('You can not post transaction details for another account');
			}
		}
		const created: TransactionDetail = await this.transactionDetailService.create({
			...args,
			type: TransactionDetailType.LOST
		});
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createLostBasedOnTransactionDetail(
		@Args('input') args: CreateLostBasedOnTransactionDetailDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<TransactionDetail> {
		if (!currentUser.hasRole(Role.ADMIN)) {
			const transactionDetail: TransactionDetail | undefined = await this.transactionDetailService.findOneById(
				args.transactionDetailId
			);
			if (transactionDetail === undefined) {
				throw new BadRequestException(`No transactionDetail with id ${args.transactionDetailId} found`);
			}
			const transaction: Transaction | undefined = await this.transactionService.findOneById(
				transactionDetail.transactionId
			);
			if (transaction === undefined) {
				throw new BadRequestException(`No transaction with id ${transactionDetail.transactionId} found`);
			} else if (transaction.accountId !== currentUser.id) {
				throw new BadRequestException('You can not post transaction details for another account');
			}
		}
		const created: TransactionDetail = await this.transactionDetailService.createLostBasedOnTransaction(args);
		pubSub.publish('transactionDetailCreated', { transactionDetailCreated: created });
		return created;
	}

	@Subscription()
	@UseGuards(GraphqlAuthGuard)
	public transactionDetailCreated(): AsyncIterator<{}> {
		return pubSub.asyncIterator('transactionDetailCreated');
	}
}
