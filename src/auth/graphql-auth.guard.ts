import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('bearer') {
	public getRequest(context: ExecutionContext): any {
		const ctx: GqlArgumentsHost = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}
