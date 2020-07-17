import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Manufacturer, Role } from '../graphql.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

const pubSub: PubSub = new PubSub();

@Resolver('Manufacturer')
export class ManufacturerResolvers {
  public constructor(private readonly manufacturerService: ManufacturerService) {}

  @Query()
  public async manufacturers(): Promise<Manufacturer[]> {
    return await this.manufacturerService.findAll();
  }

  @Query()
  public async manufacturer(@Args('id') id: string): Promise<Manufacturer | undefined> {
    return await this.manufacturerService.findOneById(id);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async createManufacturer(@Args('input') args: CreateManufacturerDto): Promise<Manufacturer> {
    const created: Manufacturer = await this.manufacturerService.create(args);
    pubSub.publish('manufacturerCreated', { manufacturerCreated: created });
    return created;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async updateManufacturer(
    @Args('id') id: string,
    @Args('input') args: CreateManufacturerDto
  ): Promise<Manufacturer> {
    const updated: Manufacturer = await this.manufacturerService.update(id, args);
    pubSub.publish('manufacturerUpdated', { manufacturerUpdated: updated });
    return updated;
  }

  @Subscription()
  public manufacturerCreated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('manufacturerCreated');
  }

  @Subscription()
  public manufacturerUpdated(): AsyncIterator<unknown> {
    return pubSub.asyncIterator('manufacturerUpdated');
  }
}
