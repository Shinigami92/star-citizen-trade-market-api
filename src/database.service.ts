import * as dotenv from 'dotenv';
import * as pg from 'pg';
import { Client } from 'pg';
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as pgCamelCase from 'pg-camelcase';

pgCamelCase.inject(pg);

dotenv.config();

export const client: Client = new Client({
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT!,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});
