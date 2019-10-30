import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '@/auth/graphql-auth.guard';
import { HasAnyRole } from '@/auth/has-any-role.decorator';
import { RoleGuard } from '@/auth/role.guard';
import { CommodityCategory, Role } from '../graphql.schema';
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
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async createCommodityCategory(@Args('input') args: CreateCommodityCategoryDto): Promise<CommodityCategory> {
		const created: CommodityCategory = await this.commodityCategoryService.create(args);
		pubSub.publish('commodityCategoryCreated', { commodityCategoryCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async updateCommodityCategory(
		@Args('id') id: string,
		@Args('input') args: CreateCommodityCategoryDto
	): Promise<CommodityCategory> {
		const updated: CommodityCategory = await this.commodityCategoryService.update(id, args);
		pubSub.publish('commodityCategoryUpdated', { commodityCategoryUpdated: updated });
		return updated;
	}

	@Subscription()
	public commodityCategoryCreated(): AsyncIterator<{}> {
		return pubSub.asyncIterator('commodityCategoryCreated');
	}

	@Subscription()
	public commodityCategoryUpdated(): AsyncIterator<{}> {
		return pubSub.asyncIterator('commodityCategoryUpdated');
	}
}
