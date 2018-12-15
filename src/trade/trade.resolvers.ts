import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/user.decorator';
import { Account, Item, Location, Trade } from 'src/graphql.schema';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { TradeService } from './trade.service';

@Resolver('Trade')
export class TradeResolvers {
	constructor(
		private readonly tradeService: TradeService,
		private readonly itemService: ItemService,
		private readonly locationService: LocationService
	) {}

	@Query('trades')
	public async trades(
		@CurrentUser() currentUser: Account | undefined,
		@Args('startLocationId') startLocationId: string,
		@Args('endLocationId') endLocationId: string
	): Promise<Trade[]> {
		return this.tradeService.findAllWhere({
			accountId: currentUser !== undefined ? currentUser.id : undefined,
			startLocationId,
			endLocationId
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
}