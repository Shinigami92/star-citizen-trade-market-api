import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { LocationType, Role } from '../graphql.schema';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { LocationTypeService } from './location-type.service';

const pubSub: PubSub = new PubSub();

@Resolver('LocationType')
export class LocationTypeResolvers {
  public constructor(private readonly locationTypeService: LocationTypeService) {}

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

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async updateLocationType(
    @Args('id') id: string,
    @Args('input') args: CreateLocationTypeDto
  ): Promise<LocationType> {
    const updated: LocationType = await this.locationTypeService.update(id, args);
    pubSub.publish('locationTypeUpdated', { locationTypeUpdated: updated });
    return updated;
  }

  @Subscription()
  public locationTypeCreated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('locationTypeCreated');
  }

  @Subscription()
  public locationTypeUpdated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('locationTypeUpdated');
  }
}
