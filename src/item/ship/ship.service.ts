import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Ship } from 'src/graphql.schema';
import { TABLENAME } from '../item.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@Injectable()
export class ShipService {
	private readonly logger: Logger = new Logger(ShipService.name);

	public async create({
		name,
		inGameSinceVersionId,
		inGameSince,
		scu,
		manufacturerId,
		focus,
		size
	}: CreateShipDto): Promise<Ship> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(name, in_game_since_version_id, in_game_since, type, scu, manufacturer_id, focus, size)` +
				" VALUES ($1::text, $2::uuid, $3::timestamptz, 'SHIP', $4::numeric, $5::uuid, $6::text, $7::numeric) RETURNING *",
			[name, inGameSinceVersionId, inGameSince, scu, manufacturerId, focus, size]
		);
		const created: Ship = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async update(
		id: string,
		{ name, focus, inGameSince, inGameSinceVersionId, manufacturerId, scu, size }: UpdateShipDto
	): Promise<Ship> {
		const updates: any[] = [];
		const values: any[] = [];
		let updateIndex: number = 2;
		if (name !== undefined) {
			updates.push(` name = $${updateIndex}::text`);
			values.push(name);
			updateIndex++;
		}
		if (focus !== undefined) {
			updates.push(` focus = $${updateIndex}::text`);
			values.push(focus);
			updateIndex++;
		}
		if (inGameSinceVersionId !== undefined) {
			updates.push(` in_game_since_version_id = $${updateIndex}::uuid`);
			values.push(inGameSinceVersionId);
			updateIndex++;
		}
		if (inGameSince !== undefined) {
			updates.push(` in_game_since = $${updateIndex}::timestamptz`);
			values.push(inGameSince);
			updateIndex++;
		}
		if (manufacturerId !== undefined) {
			updates.push(` manufacturer_id = $${updateIndex}::uuid`);
			values.push(manufacturerId);
			updateIndex++;
		}
		if (scu !== undefined) {
			updates.push(` scu = $${updateIndex}::integer`);
			values.push(scu);
			updateIndex++;
		}
		if (size !== undefined) {
			updates.push(` size = $${updateIndex}::smallint`);
			values.push(size);
			updateIndex++;
		}
		if (updates.length === 0) {
			return (await this.findOneById(id))!;
		}
		const result: QueryResult = await client.query(
			`UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
			[id, ...values]
		);
		const updated: Ship = result.rows[0];
		this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
		return updated;
	}

	public async findAll(): Promise<Ship[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE type = 'SHIP' ORDER BY name`);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Ship | undefined> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid AND type = 'SHIP'`,
			[id]
		);
		return result.rows[0];
	}
}
