import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.createType('account_role', ['USER', 'ADVANCED', 'USERADMIN', 'ADMIN']);
  pgm.addColumn('account', {
    roles: { type: 'account_role[]', notNull: true, default: '{"USER"}' }
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropColumn('account', 'roles');
  pgm.dropType('account_role');
}
