import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CommodityCategoryGuard implements CanActivate {
	private readonly logger: Logger = new Logger(CommodityCategoryGuard.name);

	public canActivate(context: ExecutionContext): boolean {
		const ctx: GqlArgumentsHost = GqlExecutionContext.create(context);
		this.logger.log(ctx.getArgs(), 'getArgs');
		this.logger.log(ctx.getContext(), 'getContext');
		// this.logger.log(ctx.getInfo(), 'getInfo');
		// this.logger.log(ctx.getRoot(), 'getRoot');
		return true;
	}
}
