import { MigrationBuilder, PgType } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.addColumn('item', {
    details: {
      type: PgType.JSONB,
      default: '{}',
      notNull: true
    }
  });
  pgm.dropColumns('item', ['scu', 'focus', 'size', 'max_ammo', 'max_range', 'damage']);
}

export function down(pgm: MigrationBuilder): void {
  pgm.addColumns('item', {
    scu: { type: PgType.INTEGER },
    focus: { type: PgType.TEXT },
    size: { type: PgType.SMALLINT },
    max_ammo: { type: PgType.SMALLINT },
    max_range: { type: PgType.INTEGER },
    damage: { type: PgType.NUMERIC }
  });
  pgm.dropColumn('item', 'details');
}
