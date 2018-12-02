import { Module } from '@nestjs/common';
import { GameVersionResolvers } from './game-version.resolvers';
import { GameVersionService } from './game-version.service';

@Module({
	providers: [GameVersionService, GameVersionResolvers]
})
export class GameVersionModule {}
