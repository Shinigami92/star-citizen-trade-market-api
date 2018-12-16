import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Location } from 'src/graphql.schema';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
	public async create(location: CreateLocationDto): Promise<Location> {
		const result: QueryResult = await client.query(
			'INSERT INTO location(name, parent_location_id, type_id, in_game_since_version_id, in_game_since)' +
				' VALUES ($1::text, $2::uuid, $3::uuid, $4::uuid, $5::timestamptz) RETURNING *',
			[
				location.name,
				location.parentLocationId,
				location.typeId,
				location.inGameSinceVersionId,
				location.inGameSince
			]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Location[]> {
		const result: QueryResult = await client.query('SELECT * FROM location ORDER BY name');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Location | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM location WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
