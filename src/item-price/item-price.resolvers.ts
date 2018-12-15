import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AccountService } from 'src/account/account.service';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { Account, Item, ItemPrice, ItemPriceVisibility, Location } from 'src/graphql.schema';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { ItemPriceService } from './item-price.service';

const pubSub: PubSub = new PubSub();

@Resolver('ItemPrice')
export class ItemPriceResolvers {
	constructor(
		private readonly itemPriceService: ItemPriceService,
		private readonly accountService: AccountService,
		private readonly itemService: ItemService,
		private readonly locationService: LocationService
	) {}

	@Query('itemPrices')
	public async itemPrices(@CurrentUser() currentUser: Account | undefined): Promise<ItemPrice[]> {
		if (currentUser === undefined) {
			return await this.itemPriceService.findAllByVisibilityInList([ItemPriceVisibility.PUBLIC]);
		}
		return await this.itemPriceService.findAllWithSignedInUser(currentUser);
	}

	@Query('itemPrice')
	public async findOneById(
		@Args('id') id: string,
		@CurrentUser() currentUser: Account | undefined
	): Promise<ItemPrice | undefined> {
		if (currentUser === undefined) {
			return await this.itemPriceService.findOneByIdAndVisibilityInList(id, [ItemPriceVisibility.PUBLIC]);
		}
		return await this.itemPriceService.findOneByIdWithSignedInUser(id, currentUser);
	}

	@Mutation('createItemPrice')
	@UseGuards(GraphqlAuthGuard)
	public async create(
		@Args('createItemPriceInput') args: CreateItemPriceDto,
		@CurrentUser() currentUser: Account
	): Promise<ItemPrice> {
		const createdItemPrice: ItemPrice = await this.itemPriceService.create({
			scannedById: currentUser.id,
			...args
		});
		pubSub.publish('itemPriceCreated', { itemPriceCreated: createdItemPrice });
		return createdItemPrice;
	}

	@Subscription('itemPriceCreated')
	public itemPriceCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('itemPriceCreated')
		};
	}

	@ResolveProperty('scannedBy')
	public async scannedBy(@Parent() itemPrice: ItemPrice): Promise<Account> {
		return (await this.accountService.findOneById(itemPrice.scannedById))!;
	}

	@ResolveProperty('item')
	public async item(@Parent() itemPrice: ItemPrice): Promise<Item> {
		return (await this.itemService.findOneById(itemPrice.itemId))!;
	}

	@ResolveProperty('location')
	public async location(@Parent() itemPrice: ItemPrice): Promise<Location> {
		return (await this.locationService.findOneById(itemPrice.locationId))!;
	}

	@ResolveProperty('unitPrice')
	public unitPrice(@Parent() itemPrice: ItemPrice): number {
		return itemPrice.price / itemPrice.quantity;
	}
}
