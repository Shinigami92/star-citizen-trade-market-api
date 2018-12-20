import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Commodity } from 'src/graphql.schema';
import { TABLENAME } from '../item.service';
import { CreateCommodityDto } from './dto/create-commodity.dto';

@Injectable()
export class CommodityService {
	private readonly logger: Logger = new Logger(CommodityService.name);

	public async create({
		name,
		commodityCategoryId,
		inGameSinceVersionId,
		inGameSince = new Date()
	}: CreateCommodityDto): Promise<Commodity> {
		let result: QueryResult;
		try {
			result = await client.query(
				`INSERT INTO ${TABLENAME}(name, commodity_category_id, in_game_since_version_id, in_game_since, type)` +
					" VALUES ($1::text, $2::uuid, $3::uuid, $4::timestamptz, 'COMMODITY') RETURNING *",
				[name, commodityCategoryId, inGameSinceVersionId, inGameSince]
			);
		} catch (error) {
			this.logger.error(error);
			switch (error.constraint) {
				case 'item_name_key':
					throw new ConflictException(`Commodity with name ${name} already exist`);
			}
			throw new InternalServerErrorException();
		}
		const created: Commodity = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async findAll(): Promise<Commodity[]> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} WHERE type = 'COMMODITY' ORDER BY name`
		);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Commodity | undefined> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid AND type = 'COMMODITY'`,
			[id]
		);
		return result.rows[0];
	}
}
