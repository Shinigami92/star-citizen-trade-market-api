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

	@Query('locationTypes')
	public async locationTypes(): Promise<LocationType[]> {
		return await this.locationTypeService.findAll();
	}

	@Query('locationType')
	public async findOneById(@Args('id') id: string): Promise<LocationType | undefined> {
		return await this.locationTypeService.findOneById(id);
	}

	@Mutation('createLocationType')
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async create(@Args('createLocationTypeInput') args: CreateLocationTypeDto): Promise<LocationType> {
		const createdLocationType: LocationType = await this.locationTypeService.create(args);
		pubSub.publish('locationTypeCreated', { locationTypeCreated: createdLocationType });
		return createdLocationType;
	}

	@Subscription('locationTypeCreated')
	public locationTypeCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('locationTypeCreated')
		};
	}
}
