import { Module } from '@nestjs/common';
import { PossessionResolvers } from './possession.resolvers';
import { PossessionService } from './possession.service';

@Module({
	providers: [PossessionService, PossessionResolvers]
})
export class PossessionModule {}
