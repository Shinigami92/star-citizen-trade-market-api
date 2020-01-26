import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.createExtension('uuid-ossp');
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropExtension('uuid-ossp');
}
