import { createParamDecorator } from '@nestjs/common';

export const CurrentUser: (...dataOrPipes: any[]) => ParameterDecorator = createParamDecorator(
	(_data: undefined, [_args, _info, { req }]: any) => req.user
);
