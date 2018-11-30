import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app: INestApplication & INestExpressApplication = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
