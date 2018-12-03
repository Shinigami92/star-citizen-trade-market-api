import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AccessControlModule } from 'nest-access-control';
import { join } from 'path';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { roles } from './app.roles';
import { AppService } from './app.service';
import { CommodityCategoryModule } from './commodity-category/commodity-category.module';
import { CommonModule } from './common/common.module';
import { GameVersionModule } from './game-version/game-version.module';
import { ItemModule } from './item/item.module';
import { LocationTypeModule } from './location-type/location-type.module';
import { LocationModule } from './location/location.module';

@Module({
	imports: [
		CommonModule,
		AccountModule,
		AccessControlModule.forRoles(roles),
		CommodityCategoryModule,
		GameVersionModule,
		ItemModule,
		LocationTypeModule,
		LocationModule,
		GraphQLModule.forRoot({
			typePaths: ['./**/*.graphql'],
			installSubscriptionHandlers: true,
			definitions: {
				path: join(process.cwd(), 'src/graphql.schema.ts'),
				outputAs: 'interface'
			},
			context: ({ req }: any): any => {
				if (!req || !req.headers || !req.headers.authorization) {
					return undefined;
				}
				return { token: req.headers.authorization };
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
