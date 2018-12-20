import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { HasAnyRole } from 'src/auth/has-any-role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Organization, Role } from 'src/graphql.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';

const pubSub: PubSub = new PubSub();

@Resolver('Organization')
export class OrganizationResolvers {
	constructor(private readonly organizationService: OrganizationService) {}

	@Query()
	public async organizations(): Promise<Organization[]> {
		return await this.organizationService.findAll();
	}

	@Query()
	public async organization(@Args('id') id: string): Promise<Organization | undefined> {
		return await this.organizationService.findOneById(id);
	}

	@Mutation()
	@UseGuards(GraphqlAuthGuard, RoleGuard)
	@HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
	public async createOrganization(@Args('input') args: CreateOrganizationDto): Promise<Organization> {
		const created: Organization = await this.organizationService.create(args);
		pubSub.publish('organizationCreated', { organizationCreated: created });
		return created;
	}

	@Subscription()
	public organizationCreated(): { subscribe: () => any } {
		return {
			subscribe: (): any => pubSub.asyncIterator('organizationCreated')
		};
	}
}
