import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Organization } from 'src/graphql.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';

const pubSub: PubSub = new PubSub();

@Resolver('Organization')
export class OrganizationResolvers {
	constructor(private readonly organizationService: OrganizationService) {}

	@Query('organizations')
	public async organizations(): Promise<Organization[]> {
		return await this.organizationService.findAll();
	}

	@Query('organization')
	public async findOneById(@Args('id') id: string): Promise<Organization | undefined> {
		return await this.organizationService.findOneById(id);
	}

	@Mutation('createOrganization')
	@UseGuards(GraphqlAuthGuard)
	public async create(@Args('createOrganizationInput') args: CreateOrganizationDto): Promise<Organization> {
		const createdOrganization: Organization = await this.organizationService.create(args);
		pubSub.publish('organizationCreated', { organizationCreated: createdOrganization });
		return createdOrganization;
	}

	@Subscription('organizationCreated')
	public organizationCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('organizationCreated')
		};
	}
}
