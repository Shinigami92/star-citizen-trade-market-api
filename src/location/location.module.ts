import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GameVersionModule } from 'src/game-version/game-version.module';
import { GameVersionService } from 'src/game-version/game-version.service';
import { LocationTypeModule } from 'src/location-type/location-type.module';
import { LocationTypeService } from 'src/location-type/location-type.service';
import { LocationResolvers } from './location.resolvers';
import { LocationService } from './location.service';

@Module({
	imports: [GameVersionModule, LocationTypeModule, CommonModule],
	providers: [LocationService, LocationResolvers, GameVersionService, LocationTypeService]
})
export class LocationModule {}
