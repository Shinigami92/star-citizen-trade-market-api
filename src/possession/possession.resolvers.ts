import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { Account, Possession, Role } from 'src/graphql.schema';
import { CreatePossessionDto } from './dto/create-possession.dto';
import { PossessionService } from './possession.service';

const pubSub: PubSub = new PubSub();

@Resolver('Possession')
export class PossessionResolvers {
	constructor(private readonly possessionService: PossessionService) {}

	@Query('possessions')
	public async possessions(): Promise<Possession[]> {
		return await this.possessionService.findAll();
	}

	@Query('possession')
	public async findOneById(@Args('id') id: string): Promise<Possession | undefined> {
		return await this.possessionService.findOneById(id);
	}

	@Mutation('createPossession')
	@UseGuards(GraphqlAuthGuard)
	public async create(
		@Args('createPossessionInput') args: CreatePossessionDto,
		@CurrentUser() currentUser: Account
	): Promise<Possession> {
		const isAdmin: boolean = currentUser.roles.find((role: Role) => role === Role.ADMIN) !== undefined;
		if (!isAdmin && args.accountId !== currentUser.id) {
			throw new BadRequestException('You do not have permission to add possession to another account');
		}
		const createdPossession: Possession = await this.possessionService.create(args);
		pubSub.publish('possessionCreated', { possessionCreated: createdPossession });
		return createdPossession;
	}

	@Subscription('possessionCreated')
	public possessionCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('possessionCreated')
		};
	}
}