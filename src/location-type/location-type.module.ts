import { Module } from '@nestjs/common';
import { LocationTypeResolvers } from './location-type.resolvers';
import { LocationTypeService } from './location-type.service';

@Module({
	providers: [LocationTypeService, LocationTypeResolvers]
})
export class LocationTypeModule {}
