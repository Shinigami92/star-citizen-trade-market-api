import { Client } from 'pg';

export const client: Client = new Client({
	host: 'localhost',
	port: 5432,
	user: 'star-citizen-trade-market',
	password: 'star-citizen-trade-market',
	database: 'star-citizen-trade-market'
});
