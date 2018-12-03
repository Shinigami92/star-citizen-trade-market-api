import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Item } from 'src/graphql.schema';

@Injectable()
export class ItemService {
	public async findAll(): Promise<Item[]> {
		const result: QueryResult = await client.query('SELECT * FROM item');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Item | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM item WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
