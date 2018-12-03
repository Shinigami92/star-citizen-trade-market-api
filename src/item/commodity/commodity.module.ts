import { Module } from '@nestjs/common';
import { CommodityCategoryModule } from 'src/commodity-category/commodity-category.module';
import { CommodityCategoryService } from 'src/commodity-category/commodity-category.service';
import { CommonModule } from 'src/common/common.module';
import { GameVersionModule } from 'src/game-version/game-version.module';
import { GameVersionService } from 'src/game-version/game-version.service';
import { CommodityResolvers } from './commodity.resolvers';
import { CommodityService } from './commodity.service';

@Module({
	imports: [GameVersionModule, CommodityCategoryModule, CommonModule],
	providers: [CommodityService, CommodityResolvers, GameVersionService, CommodityCategoryService]
})
export class CommodityModule {}
