import { CommonModule } from '@/common/common.module';
import { GameVersionModule } from '@/game-version/game-version.module';
import { GameVersionService } from '@/game-version/game-version.service';
import { LocationTypeModule } from '@/location-type/location-type.module';
import { LocationTypeService } from '@/location-type/location-type.service';
import { Module } from '@nestjs/common';
import { LocationResolvers } from './location.resolvers';
import { LocationService } from './location.service';

@Module({
	imports: [GameVersionModule, LocationTypeModule, CommonModule],
	providers: [LocationService, LocationResolvers, GameVersionService, LocationTypeService]
})
export class LocationModule {}
