import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CommodityCategoryService } from 'src/commodity-category/commodity-category.service';
import { GameVersionService } from 'src/game-version/game-version.service';
import { Commodity, CommodityCategory, GameVersion } from 'src/graphql.schema';
import { CommodityService } from './commodity.service';
import { CreateCommodityDto } from './dto/create-commodity.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Commodity')
export class CommodityResolvers {
	constructor(
		private readonly commodityService: CommodityService,
		private readonly gameVersionService: GameVersionService,
		private readonly commodityCategoryService: CommodityCategoryService
	) {}

	@Query('commodities')
	public async commodities(): Promise<Commodity[]> {
		return await this.commodityService.findAll();
	}

	@Query('commodity')
	public async findOneById(@Args('id') id: string): Promise<Commodity | undefined> {
		return await this.commodityService.findOneById(id);
	}

	@Mutation('createCommodity')
	@UseGuards(GraphqlAuthGuard)
	public async create(@Args('createCommodityInput') args: CreateCommodityDto): Promise<Commodity> {
		const createdCommodity: Commodity = await this.commodityService.create(args);
		pubSub.publish('commodityCreated', { commodityCreated: createdCommodity });
		return createdCommodity;
	}

	@Subscription('commodityCreated')
	public commodityCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('commodityCreated')
		};
	}

	@ResolveProperty('inGameSinceVersion')
	public async inGameSinceVersion(@Parent() commodity: Commodity): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(commodity.inGameSinceVersionId))!;
	}

	@ResolveProperty('commodityCategory')
	public async commodityCategory(@Parent() commodity: Commodity): Promise<CommodityCategory> {
		return (await this.commodityCategoryService.findOneById(commodity.commodityCategoryId))!;
	}
}
