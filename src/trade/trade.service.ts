import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { client } from 'src/database.service';
import { ItemPrice, ItemPriceType, ItemPriceVisibility, Trade } from 'src/graphql.schema';

export interface TradeSearchOptions {
	accountId?: string;
	startLocationId?: string;
	endLocationId?: string;
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
}

@Injectable()
export class TradeService {
	public async findAllWhere({ accountId, startLocationId, endLocationId }: TradeSearchOptions): Promise<Trade[]> {
		// TODO: filter by start and end location
		const result: QueryResult = await client.query('SELECT * FROM f_trade($1::uuid)', [accountId]);
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
			} as ItemPrice
		};
	}
}
