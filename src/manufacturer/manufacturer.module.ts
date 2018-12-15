import { Module } from '@nestjs/common';
import { ManufacturerResolvers } from './manufacturer.resolvers';
import { ManufacturerService } from './manufacturer.service';

@Module({
	providers: [ManufacturerService, ManufacturerResolvers]
})
export class ManufacturerModule {}
