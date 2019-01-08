import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Location } from 'src/graphql.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

export interface LocationSearchOptions {
	canTrade?: boolean;
}

export const TABLENAME: string = 'location';

@Injectable()
export class LocationService {
	private readonly logger: Logger = new Logger(LocationService.name);

	public async create({
		name,
		parentLocationId,
		typeId,
		inGameSinceVersionId,
		inGameSince,
		canTrade = false
	}: CreateLocationDto): Promise<Location> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(name, parent_location_id, type_id, in_game_since_version_id, in_game_since, can_trade)` +
				' VALUES ($1::text, $2::uuid, $3::uuid, $4::uuid, $5::timestamptz, $6::boolean) RETURNING *',
			[name, parentLocationId, typeId, inGameSinceVersionId, inGameSince, canTrade]
		);
		const created: Location = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async update(
		id: string,
		{ name, inGameSince, inGameSinceVersionId, parentLocationId, typeId, canTrade }: UpdateLocationDto
	): Promise<Location> {
		const updates: any[] = [];
		const values: any[] = [];
		let updateIndex: number = 2;
		if (name !== undefined) {
			updates.push(` name = $${updateIndex}::text`);
			values.push(name);
			updateIndex++;
		}
		if (inGameSince !== undefined) {
			updates.push(` in_game_since = $${updateIndex}::timestamptz`);
			values.push(inGameSince);
			updateIndex++;
		}
		if (inGameSinceVersionId !== undefined) {
			updates.push(` in_game_since_version_id = $${updateIndex}::uuid`);
			values.push(inGameSinceVersionId);
			updateIndex++;
		}
		if (parentLocationId !== undefined) {
			updates.push(` parent_location_id = $${updateIndex}::uuid`);
			values.push(parentLocationId);
			updateIndex++;
		}
		if (typeId !== undefined) {
			updates.push(` type_id = $${updateIndex}::uuid`);
			values.push(typeId);
			updateIndex++;
		}
		if (canTrade !== undefined) {
			updates.push(` can_trade = $${updateIndex}::boolean`);
			values.push(canTrade);
			updateIndex++;
		}
		if (updates.length === 0) {
			return (await this.findOneById(id))!;
		}
		const result: QueryResult = await client.query(
			`UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
			[id, ...values]
		);
		const updated: Location = result.rows[0];
		this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
		return updated;
	}

	public async findAll(): Promise<Location[]> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} ORDER BY name`);
		return result.rows;
	}

	public async findAllWhere({ canTrade }: LocationSearchOptions): Promise<Location[]> {
		let sql: string = `SELECT * FROM ${TABLENAME}`;
		const values: boolean[] = [];
		const clause: Array<Array<string | boolean>> = [];
		if (canTrade !== undefined) {
			values.push(canTrade);
			clause.push(['can_trade', '=', canTrade]);
		}
		if (clause.length > 0) {
			sql += ' WHERE';
			for (let index: number = 0; index < clause.length; index++) {
				const element: Array<string | boolean> = clause[index];
				sql += ` ${element[0]} ${element[1]} $${index + 1}::boolean`;
				if (index !== clause.length - 1) {
					sql += ' AND';
				}
			}
		}
		sql += ' ORDER BY name';
		const result: QueryResult = await client.query(sql, values);
		return result.rows;
	}

	public async findAllByParentId(parentId: string): Promise<Location[]> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} WHERE parent_location_id = $1::uuid ORDER BY name`,
			[parentId]
		);
		return result.rows;
	}

	public async findOneById(id: string): Promise<Location | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
