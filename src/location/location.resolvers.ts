import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { GameVersionService } from 'src/game-version/game-version.service';
import { GameVersion, Location, LocationType, Role } from 'src/graphql.schema';
import { LocationTypeService } from 'src/location-type/location-type.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

const pubSub: PubSub = new PubSub();

@Resolver('Location')
export class LocationResolvers {
	constructor(
		private readonly locationService: LocationService,
		private readonly locationTypeService: LocationTypeService,
		private readonly gameVersionService: GameVersionService
	) {}

	@Query()
	public async locations(): Promise<Location[]> {
		return await this.locationService.findAll();
	}

	@Query()
	public async location(@Args('id') id: string): Promise<Location | undefined> {
		return await this.locationService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async createLocation(@Args('input') args: CreateLocationDto): Promise<Location> {
		const created: Location = await this.locationService.create(args);
		pubSub.publish('locationCreated', { locationCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async updateLocation(@Args('id') id: string, @Args('input') args: UpdateLocationDto): Promise<Location> {
		const updated: Location = await this.locationService.update(id, args);
		pubSub.publish('locationUpdated', { locationUpdated: updated });
		return updated;
	}

	@Subscription()
	public locationCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('locationCreated')
		};
	}

	@Subscription()
	public locationUpdated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('locationUpdated')
		};
	}

	@ResolveProperty()
	public async parentLocation(@Parent() parent: Location): Promise<Location | null> {
		if (parent.parentLocationId !== undefined) {
			return (await this.locationService.findOneById(parent.parentLocationId))!;
		}
		return null;
	}

	@ResolveProperty()
	public async type(@Parent() parent: Location): Promise<LocationType> {
		return (await this.locationTypeService.findOneById(parent.typeId))!;
	}

	@ResolveProperty()
	public async inGameSinceVersion(@Parent() parent: Location): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(parent.inGameSinceVersionId))!;
	}

	@ResolveProperty()
	public async children(@Parent() parent: Location): Promise<Location[]> {
		return await this.locationService.findAllByParentId(parent.id);
	}
}
