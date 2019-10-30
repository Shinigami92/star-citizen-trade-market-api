import { createParamDecorator } from '@nestjs/common';

export const CurrentUser: (...dataOrPipes: any[]) => ParameterDecorator = createParamDecorator(
	(_data, [_args, _info, { req }]) => req.user
);
