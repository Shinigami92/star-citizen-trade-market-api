import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentAuthUser } from '../auth/current-user';
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasAnyRole } from '../auth/has-any-role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Possession, Role } from '../graphql.schema';
import { CreatePossessionDto } from './dto/create-possession.dto';
import { PossessionService } from './possession.service';

const pubSub: PubSub = new PubSub();

@Resolver('Possession')
export class PossessionResolvers {
  public constructor(private readonly possessionService: PossessionService) {}

  @Query()
  @UseGuards(GraphqlAuthGuard)
  public async possessions(): Promise<Possession[]> {
    return await this.possessionService.findAll();
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  public async possession(@Args('id') id: string): Promise<Possession | undefined> {
    return await this.possessionService.findOneById(id);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard, RoleGuard)
  @HasAnyRole(Role.USER, Role.ADVANCED, Role.ADMIN)
  public async createPossession(
    @Args('input') args: CreatePossessionDto,
    @CurrentUser() currentUser: CurrentAuthUser
  ): Promise<Possession> {
    if (!currentUser.hasRole(Role.ADMIN) && args.accountId !== currentUser.id) {
      throw new BadRequestException('You do not have permission to add possession to another account');
    }
    const created: Possession = await this.possessionService.create(args);
    pubSub.publish('possessionCreated', { possessionCreated: created });
    return created;
  }

  @Subscription()
  @UseGuards(GraphqlAuthGuard)
  public possessionCreated(): AsyncIterator<{}> {
    return pubSub.asyncIterator('possessionCreated');
  }
}
