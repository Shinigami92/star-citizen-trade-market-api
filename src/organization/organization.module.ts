import { Module } from '@nestjs/common';
import { OrganizationResolvers } from './organization.resolvers';
import { OrganizationService } from './organization.service';

@Module({
	providers: [OrganizationService, OrganizationResolvers]
})
export class OrganizationModule {}
