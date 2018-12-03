import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export function up(pgm: MigrationBuilder): void {
	pgm.renameColumn('organization', 'tag', 'spectrum_id');
}

export function down(pgm: MigrationBuilder): void {
	pgm.renameColumn('organization', 'spectrum_id', 'tag');
}
