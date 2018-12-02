import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GameVersionModule } from 'src/game-version/game-version.module';
import { GameVersionService } from 'src/game-version/game-version.service';
import { CommodityResolvers } from './commodity.resolvers';
import { CommodityService } from './commodity.service';

@Module({
	imports: [GameVersionModule, CommonModule],
	providers: [CommodityService, CommodityResolvers, GameVersionService]
})
export class CommodityModule {}
