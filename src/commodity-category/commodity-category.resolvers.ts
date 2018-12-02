import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/auth.guard';
import { CommodityCategory } from '../graphql.schema';
import { CommodityCategoryService } from './commodity-category.service';
import { CreateCommodityCategoryDto } from './dto/create-commodity-category.dto';

const pubSub: PubSub = new PubSub();

@Resolver('CommodityCategory')
export class CommodityCategoryResolvers {
	constructor(private readonly commodityCategoryService: CommodityCategoryService) {}

	@Query('commodityCategories')
	public async commodityCategories(): Promise<CommodityCategory[]> {
		return await this.commodityCategoryService.findAll();
	}

	@Query('commodityCategory')
	public async findOneById(@Args('id') id: string): Promise<CommodityCategory | undefined> {
		return await this.commodityCategoryService.findOneById(id);
	}

	@Mutation('createCommodityCategory')
	@UseGuards(AuthGuard)
	public async create(
		@Args('createCommodityCategoryInput') args: CreateCommodityCategoryDto
	): Promise<CommodityCategory> {
		const createdCommodityCategory: CommodityCategory = await this.commodityCategoryService.create(args);
		pubSub.publish('commodityCategoryCreated', { commodityCategoryCreated: createdCommodityCategory });
		return createdCommodityCategory;
	}

	@Subscription('commodityCategoryCreated')
	public commodityCategoryCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('commodityCategoryCreated')
		};
	}
}
