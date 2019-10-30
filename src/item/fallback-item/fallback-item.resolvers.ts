import { GameVersionService } from '@/game-version/game-version.service';
import { FallbackItem, GameVersion } from '@/graphql.schema';
import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

@Resolver('FallbackItem')
export class FallbackItemResolvers {
	constructor(private readonly gameVersionService: GameVersionService) {}

	@ResolveProperty()
	public async inGameSinceVersion(@Parent() parent: FallbackItem): Promise<GameVersion> {
		return (await this.gameVersionService.findOneById(parent.inGameSinceVersionId))!;
	}
}
