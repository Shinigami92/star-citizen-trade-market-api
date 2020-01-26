import { Logger } from '@nestjs/common';
import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Item } from '../graphql.schema';
import { ItemService } from './item.service';

@Resolver('Item')
export class ItemResolvers {
  private readonly logger: Logger = new Logger(ItemResolvers.name);

  constructor(private readonly itemService: ItemService) {}

  @Query()
  public async items(): Promise<Item[]> {
    return await this.itemService.findAll();
  }

  @Query()
  public async item(@Args('id') id: string): Promise<Item | undefined> {
    return await this.itemService.findOneById(id);
  }

  @ResolveProperty('__resolveType')
  public async resolveType(@Parent() item: Item): Promise<string | undefined> {
    switch (item.type) {
      case 'COMMODITY':
        return 'Commodity';
      case 'SHIP':
        return 'Ship';
    }
    this.logger.warn(`Found unsupported item type ${item.type}, using fallback`);
    return 'FallbackItem';
  }
}
