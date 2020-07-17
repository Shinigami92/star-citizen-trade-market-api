import { Logger } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Item } from '../graphql.schema';
import { ItemService } from './item.service';

@Resolver('Item')
export class ItemResolvers {
  private readonly logger: Logger = new Logger(ItemResolvers.name);

  public constructor(private readonly itemService: ItemService) {}

  @Query()
  public async items(): Promise<Item[]> {
    return await this.itemService.findAll();
  }

  @Query()
  public async item(@Args('id') id: string): Promise<Item | undefined> {
    return await this.itemService.findOneById(id);
  }

  @ResolveField('__resolveType')
  public resolveType(@Parent() item: Item): string {
    switch (item.type) {
      case 'COMMODITY':
        return 'Commodity';
      case 'SHIP':
        return 'Ship';
    }
    this.logger.debug(`Found unsupported item type ${item.type}, using fallback`);
    return 'FallbackItem';
  }
}
