import { MigrationBuilder, PgType } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.addColumn('account', {
    password: { type: PgType.TEXT, notNull: true, default: '' }
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropColumn('account', 'password');
}
