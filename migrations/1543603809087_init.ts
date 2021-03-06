import { ColumnDefinitions, MigrationBuilder, PgLiteral, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions = {
  id: { type: PgType.UUID, primaryKey: true, default: new PgLiteral('uuid_generate_v4()') }
};

export function up(pgm: MigrationBuilder): void {
  pgm.createTable('organization', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true },
    tag: { type: PgType.TEXT, notNull: true }
  });
  pgm.createTable('account', {
    id: { type: 'id' },
    username: { type: PgType.TEXT, notNull: true, unique: true },
    handle: { type: PgType.TEXT, notNull: true, unique: true },
    email: { type: PgType.TEXT, notNull: true, unique: true },
    main_organization_id: { type: PgType.UUID, references: { name: 'organization' } }
  });
  pgm.createTable('organization_member', {
    organization_id: { type: 'id' },
    account_id: { type: 'id' },
    since: { type: PgType.TIMESTAMPTZ }
  });
  pgm.createTable('commodity_category', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true, unique: true }
  });
  pgm.createTable('game_version', {
    id: { type: 'id' },
    identifier: { type: PgType.TEXT, notNull: true, unique: true },
    release: { type: PgType.TIMESTAMPTZ }
  });
  pgm.createTable('manufacturer', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true, unique: true }
  });
  pgm.createType('item_type', [
    'ARMS',
    'ATTACHMENT',
    'COMMODITY',
    'COOLER',
    'GADGET',
    'GUN',
    'HELMET',
    'LEGS',
    'MISSILE',
    'ORDNANCE',
    'POWER_PLANT',
    'QUANTUM_DRIVE',
    'SHIELD_GENERATOR',
    'SHIP',
    'TORSO',
    'TURRET',
    'UNDERSUIT',
    'WEAPON'
  ]);
  pgm.createTable('item', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true, unique: true },
    in_game_since_version_id: { type: PgType.UUID, references: { name: 'game_version' }, notNull: true },
    in_game_since: { type: PgType.TIMESTAMPTZ },
    type: { type: 'item_type', notNull: true },
    scu: { type: PgType.INTEGER },
    commodity_category_id: { type: PgType.UUID, references: { name: 'commodity_category' } },
    manufacturer_id: { type: PgType.UUID, references: { name: 'manufacturer' } },
    focus: { type: PgType.TEXT },
    size: { type: PgType.SMALLINT },
    max_ammo: { type: PgType.SMALLINT },
    max_range: { type: PgType.INTEGER },
    damage: { type: PgType.NUMERIC }
  });
  pgm.createTable('location_type', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true, unique: true }
  });
  pgm.createTable('location', {
    id: { type: 'id' },
    name: { type: PgType.TEXT, notNull: true, unique: true },
    in_game_since_version_id: { type: PgType.UUID, references: { name: 'game_version' }, notNull: true },
    in_game_since: { type: PgType.TIMESTAMPTZ },
    type_id: { type: PgType.UUID, references: { name: 'location_type' }, notNull: true },
    parent_location_id: { type: PgType.UUID, references: { name: 'location' } }
  });
  pgm.createType('item_price_type', ['BUY', 'SELL']);
  pgm.createType('item_price_visibility', ['PRIVATE', 'MAIN_ORGANIZATION', 'MEMBER_ORGANIZATION', 'PUBLIC']);
  pgm.createTable('item_price', {
    id: { type: 'id' },
    scanned_by_id: { type: PgType.UUID, references: { name: 'account' }, notNull: true },
    item_id: { type: PgType.UUID, references: { name: 'item' }, notNull: true },
    location_id: { type: PgType.UUID, references: { name: 'location' }, notNull: true },
    price: { type: PgType.NUMERIC, notNull: true },
    quantity: { type: PgType.BIGINT, notNull: true },
    scan_time: { type: PgType.TIMESTAMPTZ, notNull: true, default: new PgLiteral('now()') },
    type: { type: 'item_price_type', notNull: true },
    visibility: { type: 'item_price_visibility', notNull: true, default: 'PUBLIC' }
  });
  pgm.createTable('transaction', {
    id: { type: 'id' },
    account_id: { type: PgType.UUID, references: { name: 'account' }, notNull: true },
    commodity_id: { type: PgType.UUID, references: { name: 'item' }, notNull: true }
  });
  pgm.createType('transaction_detail_type', ['BOUGHT', 'SOLD', 'LOST']);
  pgm.createTable('transaction_detail', {
    id: { type: 'id' },
    transaction_id: { type: PgType.UUID, references: { name: 'transaction' }, notNull: true },
    type: { type: 'transaction_detail_type', notNull: true },
    location_id: { type: PgType.UUID, references: { name: 'location' }, notNull: true },
    price: { type: PgType.NUMERIC, notNull: true },
    quantity: { type: PgType.BIGINT, notNull: true },
    note: { type: PgType.TEXT },
    timestamp: { type: PgType.TIMESTAMPTZ, notNull: true, default: new PgLiteral('now()') }
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropTable('transaction_detail');
  pgm.dropType('transaction_detail_type');
  pgm.dropTable('transaction');
  pgm.dropTable('item_price');
  pgm.dropType('item_price_visibility');
  pgm.dropType('item_price_type');
  pgm.dropTable('location');
  pgm.dropTable('location_type');
  pgm.dropTable('item');
  pgm.dropType('item_type');
  pgm.dropTable('manufacturer');
  pgm.dropTable('game_version');
  pgm.dropTable('commodity_category');
  pgm.dropTable('organization_member');
  pgm.dropTable('account');
  pgm.dropTable('organization');
}
