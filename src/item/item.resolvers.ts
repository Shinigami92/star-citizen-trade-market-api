import { Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Item } from 'src/graphql.schema';
import { ItemService } from './item.service';

@Resolver('Item')
export class ItemResolvers {
	constructor(private readonly itemService: ItemService) {}

	@Query('items')
	public async items(): Promise<Item[]> {
		return await this.itemService.findAll();
	}

	@ResolveProperty('__resolveType')
	public async resolveType(@Parent() item: any): Promise<string | undefined> {
		switch (item.type) {
			case 'COMMODITY':
				return 'Commodity';
		}
		return undefined;
	}
}
