import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommodityCategoryModule } from './commodity-category/commodity-category.module';

@Module({
	imports: [
		CommodityCategoryModule,
		GraphQLModule.forRoot({
			typePaths: ['./**/*.graphql'],
			definitions: {
				path: join(process.cwd(), 'src/graphql.schema.ts'),
				outputAs: 'class'
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
