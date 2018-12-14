import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/user.decorator';
import { Account, Trade } from 'src/graphql.schema';
import { TradeService } from './trade.service';

@Resolver('Trade')
export class TradeResolvers {
	constructor(private readonly tradeService: TradeService) {}
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
}
