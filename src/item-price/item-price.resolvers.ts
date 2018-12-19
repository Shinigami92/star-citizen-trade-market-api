import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AccountService } from 'src/account/account.service';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { GameVersionService } from 'src/game-version/game-version.service';
import { Account, GameVersion, Item, ItemPrice, ItemPriceVisibility, Location, Role } from 'src/graphql.schema';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { UpdateItemPriceDto } from './dto/update-item-price.dto';
import { ItemPriceService } from './item-price.service';

const pubSub: PubSub = new PubSub();

@Resolver('ItemPrice')
export class ItemPriceResolvers {
	constructor(
		private readonly itemPriceService: ItemPriceService,
		private readonly accountService: AccountService,
		private readonly itemService: ItemService,
		private readonly locationService: LocationService,
		private readonly gameVersionService: GameVersionService
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
		@Args('input') args: CreateItemPriceDto,
		@CurrentUser() currentUser: Account
	): Promise<ItemPrice> {
		const createdItemPrice: ItemPrice = await this.itemPriceService.create({
			scannedById: currentUser.id,
			...args
		});
		pubSub.publish('itemPriceCreated', { itemPriceCreated: createdItemPrice });
		return createdItemPrice;
	}

	@Mutation('updateItemPrice')
	@UseGuards(GraphqlAuthGuard)
	public async update(
		@Args('id') id: string,
		@Args('input') args: UpdateItemPriceDto,
		@CurrentUser() currentUser: Account
	): Promise<ItemPrice> {
		if (currentUser.roles.find((r: Role) => r === Role.ADMIN) === undefined) {
			const itemPrice: ItemPrice = (await this.itemPriceService.findOneById(id))!;
			if (itemPrice.scannedById !== currentUser.id) {
				throw new UnauthorizedException('You can only update your own reported prices');
			}
		}
		const updatedItemPrice: ItemPrice = await this.itemPriceService.update(id, args);
		pubSub.publish('itemPriceUpdated', { itemPriceUpdated: updatedItemPrice });
		return updatedItemPrice;
	}

	@Subscription('itemPriceCreated')
	public itemPriceCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('itemPriceCreated')
		};
	}

	@Subscription('itemPriceUpdated')
	public itemPriceUpdated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('itemPriceUpdated')
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

	@ResolveProperty('scannedInGameVersion')
	public async scannedInGameVersion(@Parent() itemPrice: ItemPrice): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(itemPrice.scannedInGameVersionId))!;
	}
}
