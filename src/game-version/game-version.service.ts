import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { GameVersion } from 'src/graphql.schema';
import { CreateGameVersionDto } from './dto/create-game-version.dto';

@Injectable()
export class GameVersionService {
	public async create(gameVersion: CreateGameVersionDto): Promise<GameVersion> {
		const result: QueryResult = await client.query(
			'INSERT INTO game_version(identifier) VALUES ($1::text) RETURNING *',
			[gameVersion.identifier]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<GameVersion[]> {
		const result: QueryResult = await client.query('SELECT * FROM game_version');
		return result.rows;
	}

	public async findOneById(id: string): Promise<GameVersion | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM game_version WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
