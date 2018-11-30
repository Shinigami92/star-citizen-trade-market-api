import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { client } from './database.service';

async function bootstrap(): Promise<void> {
	const app: INestApplication & INestExpressApplication = await NestFactory.create(AppModule);
	await app.listen(3000);
	console.log('http://localhost:3000');

	await client.connect();
	console.log('Database connected');
}
bootstrap();
