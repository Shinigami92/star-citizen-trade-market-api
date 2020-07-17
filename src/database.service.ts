/* eslint-disable import/no-duplicates */
import * as dotenv from 'dotenv';
import * as pg from 'pg';
import { Client } from 'pg';
// @ts-expect-error: No type definitions :(
import * as pgCamelCase from 'pg-camelcase';

pgCamelCase.inject(pg);

dotenv.config();

let client: Client;

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;

if (DATABASE_URL === undefined) {
  client = new Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
} else {
  client = new Client(DATABASE_URL);
}

export { client };
