import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { GameVersion, Role } from 'src/graphql.schema';
import { CreateGameVersionDto } from './dto/create-game-version.dto';
import { UpdateGameVersionDto } from './dto/update-game-version.dto';
import { GameVersionService } from './game-version.service';

const pubSub: PubSub = new PubSub();

@Resolver('GameVersion')
export class GameVersionResolvers {
	constructor(private readonly gameVersionService: GameVersionService) {}

	@Query()
	public async gameVersions(): Promise<GameVersion[]> {
		return await this.gameVersionService.findAll();
	}

	@Query()
	public async gameVersion(@Args('id') id: string): Promise<GameVersion | undefined> {
		return await this.gameVersionService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async createGameVersion(@Args('input') args: CreateGameVersionDto): Promise<GameVersion> {
		const created: GameVersion = await this.gameVersionService.create(args);
		pubSub.publish('gameVersionCreated', { gameVersionCreated: created });
		return created;
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.ADVANCED, Role.ADMIN)
	public async updateGameVersion(
		@Args('id') id: string,
		@Args('input') args: UpdateGameVersionDto
	): Promise<GameVersion> {
		const updated: GameVersion = await this.gameVersionService.update(id, args);
		pubSub.publish('gameVersionUpdated', { gameVersionUpdated: updated });
		return updated;
	}

	@Subscription()
	public gameVersionCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('gameVersionCreated')
		};
	}

	@Subscription()
	public gameVersionUpdated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('gameVersionUpdated')
		};
	}
}
