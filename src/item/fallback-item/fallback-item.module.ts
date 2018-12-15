import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GameVersionModule } from 'src/game-version/game-version.module';
import { GameVersionService } from 'src/game-version/game-version.service';
import { FallbackItemResolvers } from './fallback-item.resolvers';

@Module({
	imports: [GameVersionModule, CommonModule],
	providers: [FallbackItemResolvers, GameVersionService]
})
export class FallbackItemModule {}
