import { NotFoundException } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/user.decorator';
import { GameVersionService } from '../game-version/game-version.service';
import { Account, GameVersion, Item, Location, Trade, TradeSearchInput } from '../graphql.schema';
import { ItemService } from '../item/item.service';
import { LocationService } from '../location/location.service';
import { TradeService } from './trade.service';

@Resolver('Trade')
export class TradeResolvers {
  public constructor(
    private readonly tradeService: TradeService,
    private readonly itemService: ItemService,
    private readonly locationService: LocationService,
    private readonly gameVersionService: GameVersionService
  ) {}

  @Query()
  public async trades(
    @CurrentUser() currentUser: Account | undefined,
    @Args('searchInput') searchInput?: TradeSearchInput
  ): Promise<Trade[]> {
    return this.tradeService.findAllWhere({
      accountId: currentUser !== undefined ? currentUser.id : null,
      startLocationId: searchInput !== undefined ? searchInput.startLocationId : undefined,
      endLocationId: searchInput !== undefined ? searchInput.endLocationId : undefined,
      gameVersionId: searchInput !== undefined ? searchInput.gameVersionId : undefined,
      itemIds: searchInput !== undefined ? searchInput.itemIds : undefined
    });
  }

  @ResolveField()
  public async item(@Parent() parent: Trade): Promise<Item> {
    const item: Item | undefined = await this.itemService.findOneById(parent.buyItemPrice.itemId);
    if (!item) {
      throw new NotFoundException(`Item with id ${parent.buyItemPrice.itemId} not found`);
    }
    return item;
  }

  @ResolveField()
  public async startLocation(@Parent() parent: Trade): Promise<Location> {
    const location: Location | undefined = await this.locationService.findOneById(parent.buyItemPrice.locationId);
    if (!location) {
      throw new NotFoundException(`Location with id ${parent.buyItemPrice.locationId} not found`);
    }
    return location;
  }

  @ResolveField()
  public async endLocation(@Parent() parent: Trade): Promise<Location> {
    const location: Location | undefined = await this.locationService.findOneById(parent.sellItemPrice.locationId);
    if (!location) {
      throw new NotFoundException(`Location with id ${parent.sellItemPrice.locationId} not found`);
    }
    return location;
  }

  @ResolveField()
  public async scannedInGameVersion(@Parent() parent: Trade): Promise<GameVersion> {
    const gameVersion: GameVersion | undefined = await this.gameVersionService.findOneById(
      parent.scannedInGameVersionId
    );
    if (!gameVersion) {
      throw new NotFoundException(`GameVersion with id ${parent.scannedInGameVersionId} not found`);
    }
    return gameVersion;
  }
}
