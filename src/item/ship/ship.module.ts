import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GameVersionModule } from 'src/game-version/game-version.module';
import { GameVersionService } from 'src/game-version/game-version.service';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import { ShipResolvers } from './ship.resolvers';
import { ShipService } from './ship.service';

@Module({
	imports: [GameVersionModule, ManufacturerModule, CommonModule],
	providers: [ShipService, ShipResolvers, GameVersionService, ManufacturerService]
})
export class ShipModule {}
