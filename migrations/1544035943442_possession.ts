import { ColumnDefinitions, MigrationBuilder, PgLiteral, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions = {
	id: { type: PgType.UUID, primaryKey: true, default: new PgLiteral('uuid_generate_v4()') }
};

export function up(pgm: MigrationBuilder): void {
	pgm.createType('purchase_currency', ['REAL_MONEY', 'A_UEC', 'REC', 'UEC']);
	pgm.createTable('possession', {
		id: { type: 'id' },
		account_id: { type: PgType.UUID, notNull: true, references: { name: 'account' } },
		item_id: { type: PgType.UUID, notNull: true, references: { name: 'item' } },
		purchase_price: { type: PgType.NUMERIC, notNull: true },
		purchase_currency: { type: 'purchase_currency', notNull: true },
		purchase_date: { type: PgType.DATE }
	});
}

export function down(pgm: MigrationBuilder): void {
	pgm.dropTable('possession');
	pgm.dropType('purchase_currency');
}
