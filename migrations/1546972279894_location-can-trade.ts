import { MigrationBuilder, PgType } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.addColumn('location', {
    can_trade: {
      type: PgType.BOOLEAN,
      notNull: true,
      default: false
    }
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropColumn('location', 'can_trade');
}
