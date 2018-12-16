import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/user.decorator';
import { GameVersionService } from 'src/game-version/game-version.service';
import { Account, GameVersion, Item, Location, Trade, TradeSearchInput } from 'src/graphql.schema';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { TradeService } from './trade.service';

@Resolver('Trade')
export class TradeResolvers {
	constructor(
		private readonly tradeService: TradeService,
		private readonly itemService: ItemService,
		private readonly locationService: LocationService,
		private readonly gameVersionService: GameVersionService
	) {}

	@Query('trades')
	public async trades(
		@CurrentUser() currentUser: Account | undefined,
		@Args('searchInput') searchInput?: TradeSearchInput
	): Promise<Trade[]> {
		return this.tradeService.findAllWhere({
			accountId: currentUser !== undefined ? currentUser.id : null,
			startLocationId: searchInput !== undefined ? searchInput.startLocationId : undefined,
			endLocationId: searchInput !== undefined ? searchInput.endLocationId : undefined
		});
	}

	@ResolveProperty()
	public async item(@Parent() parent: Trade): Promise<Item> {
		return (await this.itemService.findOneById(parent.buyItemPrice.itemId))!;
	}

	@ResolveProperty()
	public async startLocation(@Parent() parent: Trade): Promise<Location> {
		return (await this.locationService.findOneById(parent.buyItemPrice.locationId))!;
	}

	@ResolveProperty()
	public async endLocation(@Parent() parent: Trade): Promise<Location> {
		return (await this.locationService.findOneById(parent.sellItemPrice.locationId))!;
	}

	@ResolveProperty()
	public async scannedInGameVersion(@Parent() parent: Trade): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(parent.scannedInGameVersionId))!;
	}
}
