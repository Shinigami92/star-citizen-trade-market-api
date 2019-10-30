import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { GameVersionModule } from '../../game-version/game-version.module';
import { GameVersionService } from '../../game-version/game-version.service';
import { ManufacturerModule } from '../../manufacturer/manufacturer.module';
import { ManufacturerService } from '../../manufacturer/manufacturer.service';
import { ShipResolvers } from './ship.resolvers';
import { ShipService } from './ship.service';

@Module({
	imports: [GameVersionModule, ManufacturerModule, CommonModule],
	providers: [ShipService, ShipResolvers, GameVersionService, ManufacturerService]
})
export class ShipModule {}
