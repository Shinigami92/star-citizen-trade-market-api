import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

export const client: Client = new Client({
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT!,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});
