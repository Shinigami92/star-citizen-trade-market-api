import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/auth.guard';
import { GameVersionService } from 'src/game-version/game-version.service';
import { Commodity, GameVersion } from 'src/graphql.schema';
import { CommodityService } from './commodity.service';
import { CreateCommodityDto } from './dto/create-commodity.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Commodity')
export class CommodityResolvers {
	constructor(
		private readonly commodityService: CommodityService,
		private readonly gameVersionService: GameVersionService
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
	@UseGuards(AuthGuard)
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
	public async inGameSinceVersion(@Parent() item: any): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(item.inGameSinceVersionId))!;
	}
}
