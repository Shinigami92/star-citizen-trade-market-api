import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { LocationType } from 'src/graphql.schema';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';

@Injectable()
export class LocationTypeService {
	public async create(locationType: CreateLocationTypeDto): Promise<LocationType> {
		const result: QueryResult = await client.query(
			'INSERT INTO location_type(name) VALUES ($1::text) RETURNING *',
			[locationType.name]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<LocationType[]> {
		const result: QueryResult = await client.query('SELECT * FROM location_type');
		return result.rows;
	}

	public async findOneById(id: string): Promise<LocationType | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM location_type WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
