import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { LocationType } from 'src/graphql.schema';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';

export const TABLENAME: string = 'location_type';

@Injectable()
export class LocationTypeService {
	private readonly logger: Logger = new Logger(LocationTypeService.name);

	public async create({ name }: CreateLocationTypeDto): Promise<LocationType> {
		const result: QueryResult = await client.query(`INSERT INTO ${TABLENAME}(name) VALUES ($1::text) RETURNING *`, [
			name
		]);
		const created: LocationType = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async findAll(): Promise<LocationType[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<LocationType | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
