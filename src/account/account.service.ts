import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Account } from '../graphql.schema';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
	public async signUp(account: CreateAccountDto): Promise<Account> {
		const result: QueryResult = await client.query(
			'INSERT INTO account(username, handle, email) VALUES ($1::text, $2::text, $3::text)',
			[account.username, account.handle, account.email]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<Account[]> {
		const result: QueryResult = await client.query('SELECT * FROM account');
		return result.rows;
	}

	public async findOneById(id: string): Promise<Account | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM account WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}
}
