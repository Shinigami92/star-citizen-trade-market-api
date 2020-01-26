import { ColumnDefinitions, MigrationBuilder, PgLiteral, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export function up(pgm: MigrationBuilder): void {
  pgm.createFunction(
    'f_item_price_visible',
    [
      {
        name: 'p_account_id',
        type: PgType.UUID
      },
      {
        name: 'p_id',
        type: PgType.UUID,
        default: new PgLiteral('NULL')
      }
    ],
    {
      language: 'plpgsql',
      returns: 'SETOF item_price'
    },
    /*sql*/ `BEGIN
		RETURN QUERY
		SELECT ip.* FROM item_price ip
		WHERE ip.visibility = 'PUBLIC' AND (p_id::uuid IS NULL OR ip.id = p_id::uuid)
		UNION

		SELECT ip.* FROM item_price ip
		WHERE ip.visibility = 'PRIVATE' AND ip.scanned_by_id = p_account_id::uuid
		AND (p_id::uuid IS NULL OR ip.id = p_id::uuid)

		UNION
		SELECT ip.* FROM item_price ip
		WHERE ip.visibility = 'MAIN_ORGANIZATION'
		AND ip.scanned_by_id::text = any((
			SELECT array_agg(om.account_id)
			FROM organization_member om
			JOIN organization o ON o.id = om.organization_id
			JOIN account a ON a.main_organization_id = o.id
			WHERE a.id = p_account_id::uuid
			GROUP BY om.account_id
		)::text[])
		AND (p_id::uuid IS NULL OR ip.id = p_id::uuid)

		UNION
		SELECT ip.* FROM item_price ip
		WHERE ip.visibility = 'MEMBER_ORGANIZATION'
		AND ip.scanned_by_id::text = any((
			SELECT array_agg(om.account_id)
			FROM organization_member om
			JOIN organization o ON o.id = om.organization_id
			JOIN organization_member aom ON o.id = aom.organization_id
			WHERE aom.account_id = p_account_id::uuid
			GROUP BY om.account_id
		)::text[])
		AND (p_id::uuid IS NULL OR ip.id = p_id::uuid);
	END;`
  );
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropFunction('f_item_price_visible', [{ type: PgType.UUID }, { type: PgType.UUID }]);
}
