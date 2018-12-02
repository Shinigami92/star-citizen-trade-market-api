import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AccessControlModule } from 'nest-access-control';
import { join } from 'path';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { roles } from './app.roles';
import { AppService } from './app.service';
import { CommodityCategoryModule } from './commodity-category/commodity-category.module';

@Module({
	imports: [
		AccountModule,
		AccessControlModule.forRoles(roles),
		CommodityCategoryModule,
		GraphQLModule.forRoot({
			typePaths: ['./**/*.graphql'],
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
