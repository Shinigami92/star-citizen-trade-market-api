import { Module } from '@nestjs/common';
import { CommodityCategoryModule } from '../../commodity-category/commodity-category.module';
import { CommodityCategoryService } from '../../commodity-category/commodity-category.service';
import { CommonModule } from '../../common/common.module';
import { GameVersionModule } from '../../game-version/game-version.module';
import { GameVersionService } from '../../game-version/game-version.service';
import { CommodityResolvers } from './commodity.resolvers';
import { CommodityService } from './commodity.service';

@Module({
  imports: [GameVersionModule, CommodityCategoryModule, CommonModule],
  providers: [CommodityService, CommodityResolvers, GameVersionService, CommodityCategoryService]
})
export class CommodityModule {}
