import { Module } from '@nestjs/common';
import { ItemModule } from 'src/item/item.module';
import { ItemService } from 'src/item/item.service';
import { LocationModule } from 'src/location/location.module';
import { LocationService } from 'src/location/location.service';
import { TradeResolvers } from './trade.resolvers';
import { TradeService } from './trade.service';

@Module({
	imports: [ItemModule, LocationModule],
	providers: [TradeService, TradeResolvers, ItemService, LocationService]
})
export class TradeModule {}
