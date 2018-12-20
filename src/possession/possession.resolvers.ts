import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentAuthUser } from 'src/auth/current-user';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { Possession, Role } from 'src/graphql.schema';
import { CreatePossessionDto } from './dto/create-possession.dto';
import { PossessionService } from './possession.service';

const pubSub: PubSub = new PubSub();

@Resolver('Possession')
export class PossessionResolvers {
	constructor(private readonly possessionService: PossessionService) {}

	@Query('possessions')
	@UseGuards(GraphqlAuthGuard)
	public async possessions(): Promise<Possession[]> {
		return await this.possessionService.findAll();
	}

	@Query('possession')
	@UseGuards(GraphqlAuthGuard)
	public async findOneById(@Args('id') id: string): Promise<Possession | undefined> {
		return await this.possessionService.findOneById(id);
	}

	@Mutation('createPossession')
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async create(
		@Args('createPossessionInput') args: CreatePossessionDto,
		@CurrentUser() currentUser: CurrentAuthUser
	): Promise<Possession> {
		if (!currentUser.hasRole(Role.ADMIN) && args.accountId !== currentUser.id) {
			throw new BadRequestException('You do not have permission to add possession to another account');
		}
		const createdPossession: Possession = await this.possessionService.create(args);
		pubSub.publish('possessionCreated', { possessionCreated: createdPossession });
		return createdPossession;
	}

	@Subscription('possessionCreated')
	@UseGuards(GraphqlAuthGuard)
	public possessionCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('possessionCreated')
		};
	}
}
