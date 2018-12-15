import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Manufacturer } from '../graphql.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';

@Injectable()
export class ManufacturerService {
	public async create(manufacturer: CreateManufacturerDto): Promise<Manufacturer> {
		const result: QueryResult = await client.query('INSERT INTO manufacturer(name) VALUES ($1::text) RETURNING *', [
			manufacturer.name
		]);
		return result.rows[0];
	}

	public async findAll(): Promise<Manufacturer[]> {
		const result: QueryResult = await client.query('SELECT * FROM manufacturer');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Manufacturer | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM manufacturer WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
