import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AccountService } from '../account/account.service';
import { CommonModule } from '../common/common.module';
import { GameVersionModule } from '../game-version/game-version.module';
import { GameVersionService } from '../game-version/game-version.service';
import { ItemModule } from '../item/item.module';
import { ItemService } from '../item/item.service';
import { LocationModule } from '../location/location.module';
import { LocationService } from '../location/location.service';
import { ItemPriceResolvers } from './item-price.resolvers';
import { ItemPriceService } from './item-price.service';

@Module({
  imports: [AccountModule, ItemModule, LocationModule, GameVersionModule, CommonModule],
  providers: [ItemPriceService, ItemPriceResolvers, AccountService, ItemService, LocationService, GameVersionService]
})
export class ItemPriceModule {}
