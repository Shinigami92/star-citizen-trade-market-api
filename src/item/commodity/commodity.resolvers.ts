import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CommodityCategoryService } from 'src/commodity-category/commodity-category.service';
import { GameVersionService } from 'src/game-version/game-version.service';
import { Commodity, CommodityCategory, GameVersion } from 'src/graphql.schema';
import { CommodityService } from './commodity.service';
import { CreateCommodityDto } from './dto/create-commodity.dto';
import { UpdateCommodityDto } from './dto/update-commodity.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Commodity')
export class CommodityResolvers {
	constructor(
		private readonly commodityService: CommodityService,
		private readonly gameVersionService: GameVersionService,
		private readonly commodityCategoryService: CommodityCategoryService
	) {}

	@Query()
	public async commodities(): Promise<Commodity[]> {
		return await this.commodityService.findAll();
	}

	@Query()
	public async commodity(@Args('id') id: string): Promise<Commodity | undefined> {
		return await this.commodityService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard)
	public async createCommodity(@Args('input') args: CreateCommodityDto): Promise<Commodity> {
		const created: Commodity = await this.commodityService.create(args);
		pubSub.publish('commodityCreated', { commodityCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard)
	public async updateCommodity(@Args('id') id: string, @Args('input') args: UpdateCommodityDto): Promise<Commodity> {
		const updated: Commodity = await this.commodityService.update(id, args);
		pubSub.publish('commodityUpdated', { commodityUpdated: updated });
		return updated;
	}

	@Subscription()
	public commodityCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('commodityCreated')
		};
	}

	@Subscription()
	public commodityUpdated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('commodityUpdated')
		};
	}

	@ResolveProperty()
	public async inGameSinceVersion(@Parent() parent: Commodity): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(parent.inGameSinceVersionId))!;
	}

	@ResolveProperty()
	public async commodityCategory(@Parent() parent: Commodity): Promise<CommodityCategory> {
		return (await this.commodityCategoryService.findOneById(parent.commodityCategoryId))!;
	}
}
