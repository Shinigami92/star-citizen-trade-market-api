import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  USER = 'USER',
  ADVANCED = 'ADVANCED',
  USERADMIN = 'USERADMIN',
  ADMIN = 'ADMIN'
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.USER)
  .readAny('commodityCategory')
  .grant(AppRoles.ADVANCED)
  .extend(AppRoles.USER)
  .createAny('commodityCategory')
  .updateAny('commodityCategory');
