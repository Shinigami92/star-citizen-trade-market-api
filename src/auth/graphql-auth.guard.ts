import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
	public getRequest(context: ExecutionContext): any {
		const ctx: GraphQLExecutionContext = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}
