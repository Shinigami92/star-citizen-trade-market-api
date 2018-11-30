import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { CommodityCategory } from '../graphql.schema';

@Injectable()
export class CommodityCategoryService {
	public async create(commodityCategory: CommodityCategory): Promise<CommodityCategory> {
		const result: QueryResult = await client.query('INSERT INTO commodity_category(name) VALUES ($1::text)', [
			commodityCategory.name
		]);
		return result.rows[0];
	}

	public async findAll(): Promise<CommodityCategory[]> {
		const result: QueryResult = await client.query('SELECT * FROM commodity_category');
		return result.rows;
	}

	public async findOneById(id: string): Promise<CommodityCategory | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM commodity_category WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
