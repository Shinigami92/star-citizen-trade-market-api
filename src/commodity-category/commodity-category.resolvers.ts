import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CommodityCategory } from '../graphql.schema';
import { CommodityCategoryService } from './commodity-category.service';
import { CreateCommodityCategoryDto } from './dto/create-commodity-category.dto';

const pubSub: PubSub = new PubSub();

@Resolver('CommodityCategory')
export class CommodityCategoryResolvers {
	constructor(private readonly commodityCategoryService: CommodityCategoryService) {}

	@Query()
	public async commodityCategories(): Promise<CommodityCategory[]> {
		return await this.commodityCategoryService.findAll();
	}

	@Query()
	public async commodityCategory(@Args('id') id: string): Promise<CommodityCategory | undefined> {
		return await this.commodityCategoryService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard)
	public async createCommodityCategory(@Args('input') args: CreateCommodityCategoryDto): Promise<CommodityCategory> {
		const created: CommodityCategory = await this.commodityCategoryService.create(args);
		pubSub.publish('commodityCategoryCreated', { commodityCategoryCreated: created });
		return created;
	}

	@Subscription()
	public commodityCategoryCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('commodityCategoryCreated')
		};
	}
}
