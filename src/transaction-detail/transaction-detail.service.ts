import { client } from '@/database.service';
import { TransactionDetail, TransactionDetailType } from '@/graphql.schema';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { CreateLostBasedOnTransactionDetailDto } from './dto/create-lost-based-on-transaction-detail.dto';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';

export const TABLENAME: string = 'transaction_detail';

@Injectable()
export class TransactionDetailService {
	private readonly logger: Logger = new Logger(TransactionDetailService.name);

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
			`INSERT INTO ${TABLENAME}(transaction_id, type, location_id, price, quantity, note, "timestamp")` +
				' VALUES ($1::uuid, $2::transaction_detail_type, $3::uuid, $4::numeric, $5::bigint, $6::text, $7::timestamptz)' +
				' RETURNING *',
			[transactionId, type, locationId, price, quantity, note, timestamp]
		);
		const created: TransactionDetail = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
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
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME}`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<TransactionDetail | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
