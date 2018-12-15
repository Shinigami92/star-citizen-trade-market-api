import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Manufacturer } from '../graphql.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

const pubSub: PubSub = new PubSub();

@Resolver('Manufacturer')
export class ManufacturerResolvers {
	constructor(private readonly manufacturerService: ManufacturerService) {}

	@Query('manufacturers')
	public async manufacturers(): Promise<Manufacturer[]> {
		return await this.manufacturerService.findAll();
	}

	@Query('manufacturer')
	public async findOneById(@Args('id') id: string): Promise<Manufacturer | undefined> {
		return await this.manufacturerService.findOneById(id);
	}

	@Mutation('createManufacturer')
	@UseGuards(GraphqlAuthGuard)
	public async create(@Args('createManufacturerInput') args: CreateManufacturerDto): Promise<Manufacturer> {
		const createdManufacturer: Manufacturer = await this.manufacturerService.create(args);
		pubSub.publish('manufacturerCreated', { manufacturerCreated: createdManufacturer });
		return createdManufacturer;
	}

	@Subscription('manufacturerCreated')
	public manufacturerCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('manufacturerCreated')
		};
	}
}
