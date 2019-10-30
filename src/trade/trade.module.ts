import { GameVersionModule } from '@/game-version/game-version.module';
import { GameVersionService } from '@/game-version/game-version.service';
import { ItemModule } from '@/item/item.module';
import { ItemService } from '@/item/item.service';
import { LocationModule } from '@/location/location.module';
import { LocationService } from '@/location/location.service';
import { Module } from '@nestjs/common';
import { TradeResolvers } from './trade.resolvers';
import { TradeService } from './trade.service';

@Module({
	imports: [ItemModule, LocationModule, GameVersionModule],
	providers: [TradeService, TradeResolvers, ItemService, LocationService, GameVersionService]
})
export class TradeModule {}
