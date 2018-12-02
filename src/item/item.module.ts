import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CommodityModule } from './commodity/commodity.module';
import { ItemResolvers } from './item.resolvers';

@Module({
	imports: [CommodityModule, CommonModule],
	exports: [CommodityModule],
	providers: [ItemResolvers]
})
export class ItemModule {}
