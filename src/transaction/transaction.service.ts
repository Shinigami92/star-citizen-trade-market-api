import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Transaction, TransactionDetailType } from 'src/graphql.schema';
import { TransactionDetailService } from 'src/transaction-detail/transaction-detail.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
	constructor(private readonly transactionDetailService: TransactionDetailService) {}

	public async create({ accountId, commodityId, transactionDetail }: CreateTransactionDto): Promise<Transaction> {
		const result: QueryResult = await client.query(
			'INSERT INTO transaction(account_id, commodity_id) VALUES ($1::uuid, $2::uuid) RETURNING *',
			[accountId, commodityId]
		);
		const createdtransaction: Transaction = result.rows[0];
		await this.transactionDetailService.create({
			...transactionDetail,
			transactionId: createdtransaction.id,
			type: TransactionDetailType.BOUGHT
		});
		// TODO: create an event for the subscription transactionDetailCreated
		return createdtransaction;
	}

	public async findAll(): Promise<Transaction[]> {
		const result: QueryResult = await client.query('SELECT * FROM transaction');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Transaction | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM transaction WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
