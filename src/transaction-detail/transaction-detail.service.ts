import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { TransactionDetail, TransactionDetailType } from 'src/graphql.schema';
import { CreateLostBasedOnTransactionDetailDto } from './dto/create-lost-based-on-transaction-detail.dto';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';

@Injectable()
export class TransactionDetailService {
	public async create({
		transactionId,
		type,
		locationId,
		price,
		quantity,
		note,
		timestamp = new Date()
	}: CreateTransactionDetailDto): Promise<TransactionDetail> {
		const result: QueryResult = await client.query(
			'INSERT INTO transaction_detail(transaction_id, type, location_id, price, quantity, note, "timestamp")' +
				' VALUES ($1::uuid, $2::transaction_detail_type, $3::uuid, $4::numeric, $5::bigint, $6::text, $7::timestamptz)' +
				' RETURNING *',
			[transactionId, type, locationId, price, quantity, note, timestamp]
		);
		return result.rows[0];
	}
	public async createLostBasedOnTransaction({
		transactionDetailId,
		locationId,
		note,
		timestamp
	}: CreateLostBasedOnTransactionDetailDto): Promise<TransactionDetail> {
		const transactionDetail: TransactionDetail = (await this.findOneById(transactionDetailId))!;
		return await this.create({
			...transactionDetail,
			locationId,
			note,
			timestamp,
			type: TransactionDetailType.LOST
		});
	}

	public async findAll(): Promise<TransactionDetail[]> {
		const result: QueryResult = await client.query('SELECT * FROM transaction_detail');
		return result.rows;
	}

	public async findOneById(id: string): Promise<TransactionDetail | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM transaction_detail WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
