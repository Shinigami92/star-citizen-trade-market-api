import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { LocationType, Role } from 'src/graphql.schema';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { LocationTypeService } from './location-type.service';

const pubSub: PubSub = new PubSub();

@Resolver('LocationType')
export class LocationTypeResolvers {
	constructor(private readonly locationTypeService: LocationTypeService) {}

	@Query()
	public async locationTypes(): Promise<LocationType[]> {
		return await this.locationTypeService.findAll();
	}

	@Query()
	public async locationType(@Args('id') id: string): Promise<LocationType | undefined> {
		return await this.locationTypeService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async createLocationType(@Args('input') args: CreateLocationTypeDto): Promise<LocationType> {
		const created: LocationType = await this.locationTypeService.create(args);
		pubSub.publish('locationTypeCreated', { locationTypeCreated: created });
		return created;
	}

	@Subscription()
	public locationTypeCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('locationTypeCreated')
		};
	}
}
