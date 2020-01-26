import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AccountService } from '../account/account.service';
import { CurrentAuthUser } from '../auth/current-user';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { CurrentUser } from '../auth/user.decorator';
import { GameVersionService } from '../game-version/game-version.service';
import { Account, GameVersion, Item, ItemPrice, ItemPriceVisibility, Location, Role } from '../graphql.schema';
import { ItemService } from '../item/item.service';
import { LocationService } from '../location/location.service';
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

  @Query()
  public async itemPrices(@CurrentUser() currentUser: Account | undefined): Promise<ItemPrice[]> {
    if (currentUser === undefined) {
      return await this.itemPriceService.findAllByVisibilityInList([ItemPriceVisibility.PUBLIC]);
    }
    return await this.itemPriceService.findAllWithSignedInUser(currentUser);
  }

  @Query()
  public async itemPrice(
    @Args('id') id: string,
    @CurrentUser() currentUser: Account | undefined
  ): Promise<ItemPrice | undefined> {
    if (currentUser === undefined) {
      return await this.itemPriceService.findOneByIdAndVisibilityInList(id, [ItemPriceVisibility.PUBLIC]);
    }
    return await this.itemPriceService.findOneByIdWithSignedInUser(id, currentUser);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
  public async createItemPrice(
    @Args('input') args: CreateItemPriceDto,
    @CurrentUser() currentUser: Account
  ): Promise<ItemPrice> {
    const created: ItemPrice = await this.itemPriceService.create({
      scannedById: currentUser.id,
      ...args
    });
    pubSub.publish('itemPriceCreated', { itemPriceCreated: created });
    return created;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
  public async updateItemPrice(
    @Args('id') id: string,
    @Args('input') args: UpdateItemPriceDto,
    @CurrentUser() currentUser: CurrentAuthUser
  ): Promise<ItemPrice> {
    if (!currentUser.hasRole(Role.ADMIN)) {
      const itemPrice: ItemPrice = (await this.itemPriceService.findOneById(id))!;
      if (itemPrice.scannedById !== currentUser.id) {
        throw new UnauthorizedException('You can only update your own reported prices');
      }
    }
    const updated: ItemPrice = await this.itemPriceService.update(id, args);
    pubSub.publish('itemPriceUpdated', { itemPriceUpdated: updated });
    return updated;
  }

  @Subscription()
  public itemPriceCreated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('itemPriceCreated');
  }

  @Subscription()
  public itemPriceUpdated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('itemPriceUpdated');
  }

  @ResolveProperty()
  public async scannedBy(@Parent() parent: ItemPrice): Promise<Account> {
    return (await this.accountService.findOneById(parent.scannedById))!;
  }

  @ResolveProperty()
  public async item(@Parent() parent: ItemPrice): Promise<Item> {
    return (await this.itemService.findOneById(parent.itemId))!;
  }

  @ResolveProperty()
  public async location(@Parent() parent: ItemPrice): Promise<Location> {
    return (await this.locationService.findOneById(parent.locationId))!;
  }

  @ResolveProperty()
  public unitPrice(@Parent() parent: ItemPrice): number {
    return parent.price / parent.quantity;
  }

  @ResolveProperty()
  public async scannedInGameVersion(@Parent() parent: ItemPrice): Promise<GameVersion> {
    return (await this.gameVersionService.findOneById(parent.scannedInGameVersionId))!;
  }
}
