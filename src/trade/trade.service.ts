import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { ItemPrice, ItemPriceType, ItemPriceVisibility, Trade } from 'src/graphql.schema';

export interface TradeSearchOptions {
	accountId: string | null;
	startLocationId?: string;
	endLocationId?: string;
	gameVersionId?: string;
	itemIds?: string[];
}

interface TradeResult {
	buyId: string;
	buyScannedById: string;
	buyLocationId: string;
	buyPrice: number;
	buyQuantity: number;
	buyUnitPrice: number;
	buyScanTime: Date;
	buyVisibility: ItemPriceVisibility;
	sellId: string;
	sellScannedById: string;
	sellLocationId: string;
	sellPrice: number;
	sellQuantity: number;
	sellUnitPrice: number;
	sellScanTime: Date;
	sellVisibility: ItemPriceVisibility;
	itemId: string;
	profit: number;
	margin: number;
	scannedInGameVersionId: string;
	scanTime: Date;
}

@Injectable()
export class TradeService {
	public async findAllWhere({
		accountId = null,
		startLocationId,
		endLocationId,
		gameVersionId,
		itemIds
	}: TradeSearchOptions): Promise<Trade[]> {
		let sql: string =
			'SELECT DISTINCT ON (buy_location_id, sell_location_id, item_id, scanned_in_game_version_id)' +
			' * FROM f_trade($1::uuid)';
		const values: Array<string | string[] | null> = [accountId];
		const clause: string[][] = [];
		if (startLocationId !== undefined) {
			values.push(startLocationId);
			clause.push(['buy_location_id', '=', startLocationId]);
		}
		if (endLocationId !== undefined) {
			values.push(endLocationId);
			clause.push(['sell_location_id', '=', endLocationId]);
		}
		if (gameVersionId !== undefined) {
			values.push(gameVersionId);
			clause.push(['scanned_in_game_version_id', '=', gameVersionId]);
		}
		if (clause.length > 0) {
			sql += ' WHERE';
			for (let index: number = 0; index < clause.length; index++) {
				const element: string[] = clause[index];
				sql += ` ${element[0]} ${element[1]} $${index + 2}::uuid`;
				if (index !== clause.length - 1) {
					sql += ' AND';
				}
			}
		}
		if (itemIds !== undefined) {
			values.push(itemIds);
			sql += clause.length === 0 ? ' WHERE' : ' AND';
			sql += ` item_id = ANY($${values.length}::uuid[])`;
		}
		sql += ' ORDER BY buy_location_id, sell_location_id, item_id, scanned_in_game_version_id, scan_time DESC';
		const result: QueryResult = await client.query(sql, values);
		if (result.rowCount === 0) {
			return [];
		}
		return result.rows.map(this.convertTradeResult);
	}
	private convertTradeResult(tradeResult: TradeResult): Trade {
		return {
			buyItemPrice: {
				id: tradeResult.buyId,
				scannedById: tradeResult.buyScannedById,
				itemId: tradeResult.itemId,
				locationId: tradeResult.buyLocationId,
				price: +tradeResult.buyPrice,
				quantity: +tradeResult.buyQuantity,
				scanTime: tradeResult.buyScanTime,
				type: ItemPriceType.BUY,
				visibility: tradeResult.buyVisibility
			} as ItemPrice,
			sellItemPrice: {
				id: tradeResult.sellId,
				scannedById: tradeResult.sellScannedById,
				itemId: tradeResult.itemId,
				locationId: tradeResult.sellLocationId,
				price: +tradeResult.sellPrice,
				quantity: +tradeResult.sellQuantity,
				scanTime: tradeResult.sellScanTime,
				type: ItemPriceType.SELL,
				visibility: tradeResult.sellVisibility
			} as ItemPrice,
			profit: tradeResult.profit,
			margin: tradeResult.margin,
			scanTime: tradeResult.scanTime,
			scannedInGameVersionId: tradeResult.scannedInGameVersionId
		} as Trade;
	}
}
