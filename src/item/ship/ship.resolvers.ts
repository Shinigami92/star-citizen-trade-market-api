import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { GameVersionService } from 'src/game-version/game-version.service';
import { GameVersion, Manufacturer, Role, Ship } from 'src/graphql.schema';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { ShipService } from './ship.service';

const pubSub: PubSub = new PubSub();

@Resolver('Ship')
export class ShipResolvers {
	constructor(
		private readonly shipService: ShipService,
		private readonly gameVersionService: GameVersionService,
		private readonly manufacturerService: ManufacturerService
	) {}

	@Query('ships')
	public async ships(): Promise<Ship[]> {
		return await this.shipService.findAll();
	}

	@Query('ship')
	public async findOneById(@Args('id') id: string): Promise<Ship | undefined> {
		return await this.shipService.findOneById(id);
	}

	@Mutation('createShip')
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async create(@Args('createShipInput') args: CreateShipDto): Promise<Ship> {
		const createdShip: Ship = await this.shipService.create(args);
		pubSub.publish('shipCreated', { shipCreated: createdShip });
		return createdShip;
	}

	@Subscription('shipCreated')
	public shipCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('shipCreated')
		};
	}

	@ResolveProperty('inGameSinceVersion')
	public async inGameSinceVersion(@Parent() ship: Ship): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(ship.inGameSinceVersionId))!;
	}

	@ResolveProperty('manufacturer')
	public async manufacturer(@Parent() ship: Ship): Promise<Manufacturer> {
		return (await this.manufacturerService.findOneById(ship.manufacturerId))!;
	}
}
