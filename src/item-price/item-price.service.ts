import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Account, ItemPrice, ItemPriceVisibility } from 'src/graphql.schema';
import { CreateItemPriceDto } from './dto/create-item-price.dto';

@Injectable()
export class ItemPriceService {
	public async create({
		scannedById,
		itemId,
		locationId,
		price,
		quantity,
		scanTime = new Date(),
		type,
		visibility = ItemPriceVisibility.PUBLIC,
		scannedInGameVersionId
	}: CreateItemPriceDto): Promise<ItemPrice> {
		if (scannedInGameVersionId === undefined) {
			scannedInGameVersionId = (await client.query(
				'SELECT id FROM game_version ORDER BY identifier DESC LIMIT 1'
			)).rows[0].id;
		}
		const result: QueryResult = await client.query(
			'INSERT INTO item_price(scanned_by_id, item_id, location_id, price, quantity, scan_time, type, visibility,' +
				' scanned_in_game_version_id)' +
				' VALUES ($1::uuid, $2::uuid, $3::uuid, $4::numeric,' +
				' $5::bigint, $6::timestamptz, $7::item_price_type, $8::item_price_visibility, $9::uuid) RETURNING *',
			[scannedById, itemId, locationId, price, quantity, scanTime, type, visibility, scannedInGameVersionId]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query('SELECT * FROM item_price ORDER BY scan_time DESC');
		return result.rows;
	}

	public async findAllByVisibilityInList(visibility: ItemPriceVisibility[]): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query(
			'SELECT * FROM item_price WHERE visibility = ANY($1::item_price_visibility[]) ORDER BY scan_time DESC',
			[visibility]
		);
		return result.rows;
	}

	public async findAllWithSignedInUser({ id }: Account): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query(
			'SELECT * FROM f_item_price_visible($1::uuid) ORDER BY scan_time DESC',
			[id]
		);
		return result.rows;
	}

	public async findOneById(id: string): Promise<ItemPrice | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM item_price WHERE id = $1::uuid', [id]);
		return result.rows[0];
	}

	public async findOneByIdAndVisibilityInList(
		id: string,
		visibility: ItemPriceVisibility[]
	): Promise<ItemPrice | undefined> {
		const result: QueryResult = await client.query(
			'SELECT * FROM item_price WHERE id = $1::uuid AND visibility = ANY($2::item_price_visibility[])',
			[id, visibility]
		);
		return result.rows[0];
	}

	public async findOneByIdWithSignedInUser(id: string, currentUser: Account): Promise<ItemPrice | undefined> {
		const result: QueryResult = await client.query('SELECT * FROM f_item_price_visible($1::uuid, $2::uuid)', [
			currentUser.id,
			id
		]);
		return result.rows[0];
	}
}
