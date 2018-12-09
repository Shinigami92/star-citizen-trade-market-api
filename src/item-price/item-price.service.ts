import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { Account, ItemPrice, ItemPriceVisibility } from 'src/graphql.schema';
import { CreateItemPriceDto } from './dto/create-item-price.dto';

@Injectable()
export class ItemPriceService {
	public async create(itemPrice: CreateItemPriceDto): Promise<ItemPrice> {
		if (!itemPrice.scanTime) {
			itemPrice.scanTime = new Date();
		}
		if (itemPrice.visibility === undefined) {
			itemPrice.visibility = ItemPriceVisibility.PUBLIC;
		}
		const result: QueryResult = await client.query(
			'INSERT INTO item_price(scanned_by_id, item_id, location_id, price, quantity, scan_time, type, visibility)' +
				' VALUES ($1::uuid, $2::uuid, $3::uuid, $4::numeric,' +
				' $5::bigint, $6::timestamptz, $7::item_price_type, $8::item_price_visibility) RETURNING *',
			[
				itemPrice.scannedById,
				itemPrice.itemId,
				itemPrice.locationId,
				itemPrice.price,
				itemPrice.quantity,
				itemPrice.scanTime,
				itemPrice.type,
				itemPrice.visibility
			]
		);
		return result.rows[0];
	}

	public async findAll(): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query('SELECT * FROM item_price');
		return result.rows;
	}

	public async findAllByVisibilityInList(visibility: ItemPriceVisibility[]): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query(
			'SELECT * FROM item_price WHERE visibility = ANY($1::item_price_visibility[])',
			[visibility]
		);
		return result.rows;
	}

	public async findAllWithSignedInUser({ id }: Account): Promise<ItemPrice[]> {
		const result: QueryResult = await client.query('SELECT * FROM f_item_price_visible($1::uuid)', [id]);
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
