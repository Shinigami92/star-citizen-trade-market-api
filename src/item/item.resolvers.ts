import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

@Resolver('Item')
export class ItemResolvers {
	@ResolveProperty('__resolveType')
	public async resolveType(@Parent() item: any): Promise<string | undefined> {
		switch (item.type) {
			case 'COMMODITY':
				return 'Commodity';
		}
		return undefined;
	}
}
