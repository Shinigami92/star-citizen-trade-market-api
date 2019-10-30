import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/graphql.schema';

export const HasAnyRole: (...roles: Role[]) => any = (...roles) => SetMetadata<string, Role[]>('roles', roles);
