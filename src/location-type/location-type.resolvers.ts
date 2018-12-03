import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/auth.guard';
import { LocationType } from 'src/graphql.schema';
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
	@UseGuards(AuthGuard)
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
