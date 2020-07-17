import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { GameVersionService } from '../game-version/game-version.service';
import { GameVersion, Location, LocationSearchInput, LocationType, Role } from '../graphql.schema';
import { LocationTypeService } from '../location-type/location-type.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

const pubSub: PubSub = new PubSub();

@Resolver('Location')
export class LocationResolvers {
  public constructor(
    private readonly locationService: LocationService,
    private readonly locationTypeService: LocationTypeService,
    private readonly gameVersionService: GameVersionService
  ) {}

  @Query()
  public async locations(@Args('searchInput') searchInput?: LocationSearchInput): Promise<Location[]> {
    return await this.locationService.findAllWhere({
      canTrade: searchInput !== undefined ? searchInput.canTrade : undefined
    });
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
  public locationCreated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('locationCreated');
  }

  @Subscription()
  public locationUpdated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('locationUpdated');
  }

  @ResolveField()
  public async parentLocation(@Parent() parent: Location): Promise<Location | null> {
    if (parent.parentLocationId) {
      const location: Location | undefined = await this.locationService.findOneById(parent.parentLocationId);
      if (!location) {
        throw new NotFoundException(`Location with id ${parent.parentLocationId} not found`);
      }
      return location;
    }
    return null;
  }

  @ResolveField()
  public async type(@Parent() parent: Location): Promise<LocationType> {
    const locationType: LocationType | undefined = await this.locationTypeService.findOneById(parent.typeId);
    if (!locationType) {
      throw new NotFoundException(`LocationType with id ${parent.typeId} not found`);
    }
    return locationType;
  }

  @ResolveField()
  public async inGameSinceVersion(@Parent() parent: Location): Promise<GameVersion> {
    const gameVersion: GameVersion | undefined = await this.gameVersionService.findOneById(parent.inGameSinceVersionId);
    if (!gameVersion) {
      throw new NotFoundException(`GameVersion with id ${parent.inGameSinceVersionId} not found`);
    }
    return gameVersion;
  }

  @ResolveField()
  public async children(@Parent() parent: Location): Promise<Location[]> {
    return await this.locationService.findAllByParentId(parent.id);
  }
}
