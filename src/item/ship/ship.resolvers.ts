import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from '../../auth/graphql-auth.guard';
import { HasAnyRole } from '../../auth/has-any-role.decorator';
import { RoleGuard } from '../../auth/role.guard';
import { GameVersionService } from '../../game-version/game-version.service';
import { GameVersion, Manufacturer, Role, Ship } from '../../graphql.schema';
import { ManufacturerService } from '../../manufacturer/manufacturer.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { ShipService } from './ship.service';

const pubSub: PubSub = new PubSub();

@Resolver('Ship')
export class ShipResolvers {
  public constructor(
    private readonly shipService: ShipService,
    private readonly gameVersionService: GameVersionService,
    private readonly manufacturerService: ManufacturerService
  ) {}

  @Query()
  public async ships(): Promise<Ship[]> {
    return await this.shipService.findAll();
  }

  @Query()
  public async ship(@Args('id') id: string): Promise<Ship | undefined> {
    return await this.shipService.findOneById(id);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async createShip(@Args('input') args: CreateShipDto): Promise<Ship> {
    const created: Ship = await this.shipService.create(args);
    pubSub.publish('shipCreated', { shipCreated: created });
    return created;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.ADVANCED, Role.ADMIN)
  public async updateShip(@Args('id') id: string, @Args('input') args: UpdateShipDto): Promise<Ship> {
    const updated: Ship = await this.shipService.update(id, args);
    pubSub.publish('shipUpdated', { shipUpdated: updated });
    return updated;
  }

  @Subscription()
  public shipCreated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('shipCreated');
  }

  @Subscription()
  public shipUpdated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('shipUpdated');
  }

  @ResolveProperty()
  public async inGameSinceVersion(@Parent() parent: Ship): Promise<GameVersion> {
    return (await this.gameVersionService.findOneById(parent.inGameSinceVersionId))!;
  }

  @ResolveProperty()
  public async manufacturer(@Parent() parent: Ship): Promise<Manufacturer> {
    return (await this.manufacturerService.findOneById(parent.manufacturerId))!;
  }
}
