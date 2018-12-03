import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Commodity } from 'src/graphql.schema';
import { CreateCommodityDto } from './dto/create-commodity.dto';

@Injectable()
export class CommodityService {
	public async create(commodity: CreateCommodityDto): Promise<Commodity> {
		const result: QueryResult = await client.query(
			'INSERT INTO item(name, in_game_since_version_id, in_game_since, type, commodity_category_id)' +
				" VALUES ($1::text, $2::uuid, $3::timestamptz, 'COMMODITY', $4::uuid) RETURNING *",
			[commodity.name, commodity.inGameSinceVersionId, commodity.inGameSince, commodity.commodityCategoryId]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Commodity[]> {
		const result: QueryResult = await client.query("SELECT * FROM item WHERE type = 'COMMODITY'");
		return result.rows;
	}

	public async findOneById(id: string): Promise<Commodity | undefined> {
		const result: QueryResult = await client.query(
			"SELECT * FROM item WHERE id = $1::uuid AND type = 'COMMODITY'",
			[id]
		);
		return result.rows[0];
	}
}
