import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { CommodityModule } from './commodity/commodity.module';
import { ItemResolvers } from './item.resolvers';
import { ItemService } from './item.service';

@Module({
	imports: [CommodityModule, CommonModule],
	exports: [CommodityModule],
	providers: [ItemService, ItemResolvers]
})
export class ItemModule {}
