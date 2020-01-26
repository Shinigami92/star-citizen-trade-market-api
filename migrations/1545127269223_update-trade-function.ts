import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.dropFunction('f_trade', [{ type: PgType.UUID }]);
  pgm.createFunction(
    'f_trade',
    [
      {
        name: 'p_account_id',
        type: PgType.UUID
      }
    ],
    {
      language: 'plpgsql',
      returns:
        'TABLE(buy_id uuid, buy_scanned_by_id uuid, buy_location_id uuid, buy_price numeric,' +
        ' buy_quantity bigint, buy_unit_price numeric, buy_scan_time timestamptz,' +
        ' buy_visibility item_price_visibility, sell_id uuid, sell_scanned_by_id uuid,' +
        ' sell_location_id uuid, sell_price numeric, sell_quantity bigint, sell_unit_price numeric,' +
        ' sell_scan_time timestamptz, sell_visibility item_price_visibility, item_id uuid,' +
        ' scanned_in_game_version_id uuid, scan_time timestamptz, profit numeric, margin numeric)'
    },
    /*sql*/ `BEGIN
		RETURN QUERY
		SELECT
				b.id AS buy_id,
				b.scanned_by_id AS buy_scanned_by_id,
				b.location_id AS buy_location_id,
				b.price AS buy_price,
				b.quantity AS buy_quantity,
				b.price / b.quantity::numeric AS buy_unit_price,
				b.scan_time AS buy_scan_time,
				b.visibility AS buy_visibility,
				s.id AS sell_id,
				s.scanned_by_id AS sell_scanned_by_id,
				s.location_id AS sell_location_id,
				s.price AS sell_price,
				s.quantity AS sell_quantity,
				s.price / s.quantity::numeric AS sell_unit_price,
				s.scan_time AS sell_scan_time,
				s.visibility AS sell_visibility,
				b.item_id,
				b.scanned_in_game_version_id,
				CASE
				WHEN b.scan_time > s.scan_time THEN s.scan_time
				ELSE b.scan_time
				END AS scan_time,
				s.price / s.quantity::numeric - b.price / b.quantity::numeric AS profit,
				s.price / s.quantity::numeric / (b.price / b.quantity::numeric) * 100::numeric - 100::numeric AS margin
		FROM f_item_price_visible(p_account_id) b
		JOIN f_item_price_visible(p_account_id) s ON s.type = 'SELL'::item_price_type
		WHERE b.type = 'BUY'::item_price_type
		AND b.id <> s.id AND b.item_id = s.item_id
		AND b.scanned_in_game_version_id = s.scanned_in_game_version_id;
	END;`
  );
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropFunction('f_trade', [{ type: PgType.UUID }]);
  pgm.createFunction(
    'f_trade',
    [
      {
        name: 'p_account_id',
        type: PgType.UUID
      }
    ],
    {
      language: 'plpgsql',
      returns:
        'TABLE(buy_id uuid, buy_scanned_by_id uuid, buy_location_id uuid, buy_price numeric,' +
        ' buy_quantity bigint, buy_unit_price numeric, buy_scan_time timestamptz,' +
        ' buy_visibility item_price_visibility, sell_id uuid, sell_scanned_by_id uuid,' +
        ' sell_location_id uuid, sell_price numeric, sell_quantity bigint, sell_unit_price numeric,' +
        ' sell_scan_time timestamptz, sell_visibility item_price_visibility, item_id uuid,' +
        ' scanned_in_game_version_id uuid, profit numeric, margin numeric)'
    },
    /*sql*/ `BEGIN
		RETURN QUERY
		SELECT
				b.id AS buy_id,
				b.scanned_by_id AS buy_scanned_by_id,
				b.location_id AS buy_location_id,
				b.price AS buy_price,
				b.quantity AS buy_quantity,
				b.price / b.quantity::numeric AS buy_unit_price,
				b.scan_time AS buy_scan_time,
				b.visibility AS buy_visibility,
				s.id AS sell_id,
				s.scanned_by_id AS sell_scanned_by_id,
				s.location_id AS sell_location_id,
				s.price AS sell_price,
				s.quantity AS sell_quantity,
				s.price / s.quantity::numeric AS sell_unit_price,
				s.scan_time AS sell_scan_time,
				s.visibility AS sell_visibility,
				b.item_id,
				b.scanned_in_game_version_id,
				s.price / s.quantity::numeric - b.price / b.quantity::numeric AS profit,
				s.price / s.quantity::numeric / (b.price / b.quantity::numeric) * 100::numeric - 100::numeric AS margin
		FROM f_item_price_visible(p_account_id) b
		JOIN f_item_price_visible(p_account_id) s ON s.type = 'SELL'::item_price_type
		WHERE b.type = 'BUY'::item_price_type
		AND b.id <> s.id AND b.item_id = s.item_id
		AND b.scanned_in_game_version_id = s.scanned_in_game_version_id;
	END;`
  );
}
