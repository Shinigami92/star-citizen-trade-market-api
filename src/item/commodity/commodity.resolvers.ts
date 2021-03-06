import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '../../auth/graphql-auth.guard';
import { HasAnyRole } from '../../auth/has-any-role.decorator';
import { RoleGuard } from '../../auth/role.guard';
import { CommodityCategoryService } from '../../commodity-category/commodity-category.service';
import { GameVersionService } from '../../game-version/game-version.service';
import { Commodity, CommodityCategory, GameVersion, Role } from '../../graphql.schema';
import { CommodityService } from './commodity.service';
import { CreateCommodityDto } from './dto/create-commodity.dto';
import { UpdateCommodityDto } from './dto/update-commodity.dto';

const pubSub: PubSub = new PubSub();

@Resolver('Commodity')
export class CommodityResolvers {
  public constructor(
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
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async createCommodity(@Args('input') args: CreateCommodityDto): Promise<Commodity> {
    const created: Commodity = await this.commodityService.create(args);
    pubSub.publish('commodityCreated', { commodityCreated: created });
    return created;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async updateCommodity(@Args('id') id: string, @Args('input') args: UpdateCommodityDto): Promise<Commodity> {
    const updated: Commodity = await this.commodityService.update(id, args);
    pubSub.publish('commodityUpdated', { commodityUpdated: updated });
    return updated;
  }

  @Subscription()
  public commodityCreated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('commodityCreated');
  }

  @Subscription()
  public commodityUpdated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('commodityUpdated');
  }

  @ResolveField()
  public async inGameSinceVersion(@Parent() parent: Commodity): Promise<GameVersion> {
    const gameVersion: GameVersion | undefined = await this.gameVersionService.findOneById(parent.inGameSinceVersionId);
    if (!gameVersion) {
      throw new NotFoundException(`GameVersion with id ${parent.inGameSinceVersionId} not found`);
    }
    return gameVersion;
  }

  @ResolveField()
  public async commodityCategory(@Parent() parent: Commodity): Promise<CommodityCategory> {
    const commodityCategory: CommodityCategory | undefined = await this.commodityCategoryService.findOneById(
      parent.commodityCategoryId
    );
    if (!commodityCategory) {
      throw new NotFoundException(`CommodityCategory with id ${parent.commodityCategoryId} not found`);
    }
    return commodityCategory;
  }
}
