import { INestApplication, INestExpressApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { client } from './database.service';

dotenv.config();

export const PORT: number = process.env.API_PORT !== undefined ? +process.env.API_PORT! : 3000;

async function bootstrap(): Promise<void> {
	const app: INestApplication & INestExpressApplication = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(PORT);
	Logger.log(`Started at http://localhost:${PORT}`, 'bootstrap');
	Logger.log(`GraphQL endpoint http://localhost:${PORT}/graphql`, 'bootstrap');

	await client.connect();
	Logger.log('Connected to database', 'bootstrap');
}
bootstrap();
