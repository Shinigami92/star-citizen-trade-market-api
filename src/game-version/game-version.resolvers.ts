import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { GameVersion } from 'src/graphql.schema';
import { CreateGameVersionDto } from './dto/create-game-version.dto';
import { GameVersionService } from './game-version.service';

const pubSub: PubSub = new PubSub();

@Resolver('GameVersion')
export class GameVersionResolvers {
	constructor(private readonly gameVersionService: GameVersionService) {}

	@Query('gameVersions')
	public async gameVersions(): Promise<GameVersion[]> {
		return await this.gameVersionService.findAll();
	}

	@Query('gameVersion')
	public async findOneById(@Args('id') id: string): Promise<GameVersion | undefined> {
		return await this.gameVersionService.findOneById(id);
	}

	@Mutation('createGameVersion')
	@UseGuards(GraphqlAuthGuard)
	public async create(@Args('createGameVersionInput') args: CreateGameVersionDto): Promise<GameVersion> {
		const createdGameVersion: GameVersion = await this.gameVersionService.create(args);
		pubSub.publish('gameVersionCreated', { gameVersionCreated: createdGameVersion });
		return createdGameVersion;
	}

	@Subscription('gameVersionCreated')
	public GameVersionCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('GameVersionCreated')
		};
	}
}
