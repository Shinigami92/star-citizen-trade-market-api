import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Possession } from 'src/graphql.schema';
import { CreatePossessionDto } from './dto/create-possession.dto';

@Injectable()
export class PossessionService {
	public async create({
		accountId,
		itemId,
		purchasePrice,
		purchaseCurrency,
		purchaseDate
	}: CreatePossessionDto): Promise<Possession> {
		const result: QueryResult = await client.query(
			'INSERT INTO possession(account_id, item_id, purchase_price, purchase_currency, purchase_date)' +
				' VALUES ($1::uuid, $2::uuid, $3::numeric, $4::purchase_currency, $5::date) RETURNING *',
			[accountId, itemId, purchasePrice, purchaseCurrency, purchaseDate]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Possession[]> {
		const result: QueryResult = await client.query('SELECT * FROM possession');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Possession | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM possession WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
