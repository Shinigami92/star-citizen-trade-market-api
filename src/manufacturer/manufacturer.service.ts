import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Manufacturer } from '../graphql.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';

export const TABLENAME: string = 'manufacturer';

@Injectable()
export class ManufacturerService {
	private readonly logger: Logger = new Logger(ManufacturerService.name);

	public async create({ name }: CreateManufacturerDto): Promise<Manufacturer> {
		const result: QueryResult = await client.query(`INSERT INTO ${TABLENAME}(name) VALUES ($1::text) RETURNING *`, [
			name
		]);
		const created: Manufacturer = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async findAll(): Promise<Manufacturer[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Manufacturer | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
