import { client } from '@/database.service';
import { Transaction, TransactionDetailType } from '@/graphql.schema';
import { TransactionDetailService } from '@/transaction-detail/transaction-detail.service';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { CreateTransactionDto } from './dto/create-transaction.dto';

export const TABLENAME: string = 'transaction';

@Injectable()
export class TransactionService {
	private readonly logger: Logger = new Logger(TransactionService.name);
	constructor(private readonly transactionDetailService: TransactionDetailService) {}

	public async create({ accountId, commodityId, transactionDetail }: CreateTransactionDto): Promise<Transaction> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(account_id, commodity_id) VALUES ($1::uuid, $2::uuid) RETURNING *`,
			[accountId, commodityId]
		);
		const createdTransaction: Transaction = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${createdTransaction.id}`);
		await this.transactionDetailService.create({
			...transactionDetail,
			transactionId: createdTransaction.id,
			type: TransactionDetailType.BOUGHT
		});
		// TODO: create an event for the subscription transactionDetailCreated
		return createdTransaction;
	}

	public async findAll(): Promise<Transaction[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Transaction | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
