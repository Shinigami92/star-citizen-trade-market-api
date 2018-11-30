import { Args, Query, Resolver } from '@nestjs/graphql';
import { CommodityCategory } from '../graphql.schema';
import { CommodityCategoryService } from './commodity-category.service';

@Resolver('CommodityCategory')
export class CommodityCategoryResolvers {
	constructor(private readonly commodityCategoryService: CommodityCategoryService) {}

	@Query('commodityCategories')
	public async commodityCategory(): Promise<CommodityCategory[]> {
		return await this.commodityCategoryService.findAll();
	}

	@Query('commodityCategory')
	public async findOneById(
		@Args('id')
		id: string
	): Promise<CommodityCategory | undefined> {
		return await this.commodityCategoryService.findOneById(id);
	}
}
