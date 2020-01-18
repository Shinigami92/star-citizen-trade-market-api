import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { client } from './database.service';

dotenv.config();

const HOSTNAME: string | undefined = process.env.API_HOSTNAME;
const PORT: number = process.env.API_PORT !== undefined ? +process.env.API_PORT : 3000;

async function bootstrap(): Promise<void> {
	const app: INestApplication = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	if (HOSTNAME) {
		await app.listen(PORT, HOSTNAME);
	} else {
		await app.listen(PORT);
	}
	const url: string = await app.getUrl();
	Logger.log(`Started at ${url}`, 'bootstrap');
	Logger.log(`GraphQL endpoint ${url}/graphql`, 'bootstrap');

	await client.connect();
	Logger.log('Connected to database', 'bootstrap');
}
bootstrap();
