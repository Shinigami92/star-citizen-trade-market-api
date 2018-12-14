import { Module } from '@nestjs/common';
import { TradeResolvers } from './trade.resolvers';
import { TradeService } from './trade.service';

@Module({
	providers: [TradeService, TradeResolvers]
})
export class TradeModule {}
