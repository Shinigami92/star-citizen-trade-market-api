import { Role } from '@/graphql.schema';
import { SetMetadata } from '@nestjs/common';

export const HasAnyRole: (...roles: Role[]) => any = (...roles) => SetMetadata<string, Role[]>('roles', roles);
