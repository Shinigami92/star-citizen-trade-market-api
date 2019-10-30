import { client } from '@/database.service';
import { GameVersion } from '@/graphql.schema';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'pg';
import { CreateGameVersionDto } from './dto/create-game-version.dto';
import { UpdateGameVersionDto } from './dto/update-game-version.dto';

export const TABLENAME: string = 'game_version';

@Injectable()
export class GameVersionService {
	private readonly logger: Logger = new Logger(GameVersionService.name);

	public async create({ identifier, release }: CreateGameVersionDto): Promise<GameVersion> {
		const result: QueryResult = await client.query(
			`INSERT INTO ${TABLENAME}(identifier, release) VALUES ($1::text, $2::timestamptz) RETURNING *`,
			[identifier, release]
		);
		const created: GameVersion = result.rows[0];
		this.logger.log(`Created ${TABLENAME} with id ${created.id}`);
		return created;
	}

	public async update(id: string, { identifier, release }: UpdateGameVersionDto): Promise<GameVersion> {
		const updates: any[] = [];
		const values: any[] = [];
		let updateIndex: number = 2;
		if (identifier !== undefined) {
			updates.push(` identifier = $${updateIndex}::text`);
			values.push(identifier);
			updateIndex++;
		}
		if (release !== undefined) {
			updates.push(` release = $${updateIndex}::timestamptz`);
			values.push(release);
			updateIndex++;
		}
		if (updates.length === 0) {
			return (await this.findOneById(id))!;
		}
		const result: QueryResult = await client.query(
			`UPDATE ${TABLENAME} SET${updates.join(', ')} WHERE id = $1::uuid RETURNING *`,
			[id, ...values]
		);
		const updated: GameVersion = result.rows[0];
		this.logger.log(`Updated ${TABLENAME} with id ${updated.id}`);
		return updated;
	}

	public async findAll(): Promise<GameVersion[]> {
		const result: QueryResult = await client.query(
			`SELECT * FROM ${TABLENAME} ORDER BY release DESC NULLS LAST, identifier DESC`
		);
		return result.rows;
	}

	public async findOneById(id: string): Promise<GameVersion | undefined> {
		const result: QueryResult = await client.query(`SELECT * FROM ${TABLENAME} WHERE id = $1::uuid`, [id]);
		return result.rows[0];
	}
}
