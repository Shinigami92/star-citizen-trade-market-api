import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { GameVersionModule } from '../../game-version/game-version.module';
import { GameVersionService } from '../../game-version/game-version.service';
import { FallbackItemResolvers } from './fallback-item.resolvers';

@Module({
	imports: [GameVersionModule, CommonModule],
	providers: [FallbackItemResolvers, GameVersionService]
})
export class FallbackItemModule {}
