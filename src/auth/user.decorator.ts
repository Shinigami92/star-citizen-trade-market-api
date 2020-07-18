import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.getArgByIndex(2)?.req?.user
);
