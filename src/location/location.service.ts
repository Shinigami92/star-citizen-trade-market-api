import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Location } from 'src/graphql.schema';
import { CreateLocationDto } from './dto/create-location.dto';

export const TABLENAME: string = 'location';

@Injectable()
export class LocationService {
	private readonly logger: Logger = new Logger(LocationService.name);

	public async create({
		name,
		parentLocationId,
		typeId,
		inGameSinceVersionId,
		inGameSince
	}: CreateLocationDto): Promise<Location> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(name, parent_location_id, type_id, in_game_since_version_id, in_game_since)` +
				' VALUES ($1::text, $2::uuid, $3::uuid, $4::uuid, $5::timestamptz) RETURNING *',
			[name, parentLocationId, typeId, inGameSinceVersionId, inGameSince]
		);
		const created: Location = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async findAll(): Promise<Location[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Location | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
