import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Ship } from 'src/graphql.schema';
import { CreateShipDto } from './dto/create-ship.dto';

@Injectable()
export class ShipService {
	public async create(ship: CreateShipDto): Promise<Ship> {
		const result: QueryResult = await client.query(
			'INSERT INTO item(name, in_game_since_version_id, in_game_since, type, scu, manufacturer_id, focus, size)' +
				" VALUES ($1::text, $2::uuid, $3::timestamptz, 'SHIP', $4::numeric, $5::uuid, $6::text, $7::numeric) RETURNING *",
			[
				ship.name,
				ship.inGameSinceVersionId,
				ship.inGameSince,
				ship.scu,
				ship.manufacturerId,
				ship.focus,
				ship.size
			]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Ship[]> {
		const result: QueryResult = await client.query("SELECT * FROM item WHERE type = 'SHIP'");
		return result.rows;
	}

	public async findOneById(id: string): Promise<Ship | undefined> {
		const result: QueryResult = await client.query("SELECT * FROM item WHERE id = $1::uuid AND type = 'SHIP'", [
			id
		]);
		return result.rows[0];
	}
}
