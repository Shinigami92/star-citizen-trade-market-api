import { NotFoundException } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GameVersionService } from '../../game-version/game-version.service';
import { FallbackItem, GameVersion } from '../../graphql.schema';

@Resolver('FallbackItem')
export class FallbackItemResolvers {
  public constructor(private readonly gameVersionService: GameVersionService) {}

  @ResolveField()
  public async inGameSinceVersion(@Parent() parent: FallbackItem): Promise<GameVersion> {
    const gameVersion: GameVersion | undefined = await this.gameVersionService.findOneById(parent.inGameSinceVersionId);
    if (!gameVersion) {
      throw new NotFoundException(`GameVersion with id ${parent.inGameSinceVersionId} not found`);
    }
    return gameVersion;
  }
}
