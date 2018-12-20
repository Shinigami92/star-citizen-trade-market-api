import { ReflectMetadata } from '@nestjs/common';
import { Role } from 'src/graphql.schema';

export const HasAnyRole: (...roles: Role[]) => any = (...roles: Role[]): any =>
	ReflectMetadata<string, Role[]>('roles', roles);
