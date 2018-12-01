import { INestApplication, INestExpressApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { client } from './database.service';

async function bootstrap(): Promise<void> {
	const app: INestApplication & INestExpressApplication = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	const port: number = 3000;
	await app.listen(port);
	Logger.log(`Started at http://localhost:${port}`, 'bootstrap');
	Logger.log(`GraphQL endpoint http://localhost:${port}/graphql`, 'bootstrap');

	await client.connect();
	Logger.log('Connected to database', 'bootstrap');
}
bootstrap();
