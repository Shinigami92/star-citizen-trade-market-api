import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { CommonModule } from 'src/common/common.module';
import { ItemModule } from 'src/item/item.module';
import { ItemService } from 'src/item/item.service';
import { LocationModule } from 'src/location/location.module';
import { LocationService } from 'src/location/location.service';
import { ItemPriceResolvers } from './item-price.resolvers';
import { ItemPriceService } from './item-price.service';

@Module({
	imports: [AccountModule, ItemModule, LocationModule, CommonModule],
	providers: [ItemPriceService, ItemPriceResolvers, AccountService, ItemService, LocationService]
})
export class ItemPriceModule {}
