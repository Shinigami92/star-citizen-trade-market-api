import { Module } from '@nestjs/common';
import { CommodityCategoryResolvers } from './commodity-category.resolvers';
import { CommodityCategoryService } from './commodity-category.service';

@Module({
	providers: [CommodityCategoryService, CommodityCategoryResolvers]
})
export class CommodityCategoryModule {}
