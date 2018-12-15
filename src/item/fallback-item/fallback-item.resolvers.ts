import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { GameVersionService } from 'src/game-version/game-version.service';
import { FallbackItem, GameVersion } from 'src/graphql.schema';

@Resolver('FallbackItem')
export class FallbackItemResolvers {
	constructor(private readonly gameVersionService: GameVersionService) {}

	@ResolveProperty('inGameSinceVersion')
	public async inGameSinceVersion(@Parent() parent: FallbackItem): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(parent.inGameSinceVersionId))!;
	}
}
