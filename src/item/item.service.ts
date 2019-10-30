import { client } from '@/database.service';
import { Item } from '@/graphql.schema';
import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';

export const TABLENAME: string = 'item';

@Injectable()
export class ItemService {
	public async findAll(): Promise<Item[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Item | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
