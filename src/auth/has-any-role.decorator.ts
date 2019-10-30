import { SetMetadata } from '@nestjs/common';
import { Role } from '../graphql.schema';

export const HasAnyRole: (...roles: Role[]) => any = (...roles) => SetMetadata<string, Role[]>('roles', roles);
