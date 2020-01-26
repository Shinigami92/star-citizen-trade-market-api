import { CanActivate, ExecutionContext, Injectable, Logger, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../graphql.schema';
import { CurrentAuthUser } from './current-user';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger: Logger = new Logger(RoleGuard.name);

  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    // tslint:disable-next-line:ban-types
    const ctxHandler: Function = context.getHandler();
    const ctxClass: Type<any> = context.getClass();
    const functionReferenceName: string = `${ctxClass.name}::${ctxHandler.name}`;
    const roles: Role[] | undefined = this.reflector.get<Role[] | undefined>('roles', ctxHandler);
    if (roles === undefined) {
      this.logger.warn(`Attention! Decorator not present at ${functionReferenceName}`);
      return false;
    } else if (roles.length === 0) {
      this.logger.warn(`Attention! You should always provide at least one Role (${functionReferenceName})`);
      return false;
    }
    const user: CurrentAuthUser = context.getArgs()[2].req.user;
    const allowed: boolean = user.hasAnyRole(roles);
    if (!allowed) {
      this.logger.log(
        `User with id ${
          user.id
        } tried to access ${functionReferenceName} but does not have one of the following roles: ${roles.join(', ')}`
      );
    }
    return allowed;
  }
}
