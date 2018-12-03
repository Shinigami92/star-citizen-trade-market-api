import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/auth.guard';
import { GameVersionService } from 'src/game-version/game-version.service';
import { GameVersion, Location, LocationType } from 'src/graphql.schema';
import { LocationTypeService } from 'src/location-type/location-type.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationService } from './location.service';

const pubSub: PubSub = new PubSub();

@Resolver('Location')
export class LocationResolvers {
	constructor(
		private readonly locationService: LocationService,
		private readonly locationTypeService: LocationTypeService,
		private readonly gameVersionService: GameVersionService
	) {}

	@Query('locations')
	public async locations(): Promise<Location[]> {
		return await this.locationService.findAll();
	}

	@Query('location')
	public async findOneById(@Args('id') id: string): Promise<Location | undefined> {
		return await this.locationService.findOneById(id);
	}

	@Mutation('createLocation')
	@UseGuards(AuthGuard)
	public async create(@Args('createLocationInput') args: CreateLocationDto): Promise<Location> {
		const createdLocation: Location = await this.locationService.create(args);
		pubSub.publish('locationCreated', { locationCreated: createdLocation });
		return createdLocation;
	}

	@Subscription('locationCreated')
	public locationCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('locationCreated')
		};
	}

	@ResolveProperty('parentLocation')
	public async parentLocation(@Parent() location: Location): Promise<Location | null> {
		if (location.parentLocationId !== undefined) {
			return (await this.locationService.findOneById(location.parentLocationId))!;
		}
		return null;
	}

	@ResolveProperty('type')
	public async type(@Parent() location: Location): Promise<LocationType> {
		return (await this.locationTypeService.findOneById(location.typeId))!;
	}

	@ResolveProperty('inGameSinceVersion')
	public async inGameSinceVersion(@Parent() location: any): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(location.inGameSinceVersionId))!;
	}
}
