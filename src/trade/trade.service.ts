import { Injectable } from '@nestjs/common';
import { and, cast, eq, GLOBAL_STAR, QueryBuilder, select, UUID } from '@shinigami92/pg-query-builder';
import { ComparisonOperator } from '@shinigami92/pg-query-builder/lib/operators/comparison/comparison-operator';
import { FromQueryBuilder } from '@shinigami92/pg-query-builder/lib/query/from';
import { QueryResult } from 'pg';
import { f_trade } from 'src/database-definition/f_trade';
import { client } from 'src/database.service';
import { ItemPrice, ItemPriceType, ItemPriceVisibility, Trade } from 'src/graphql.schema';

export interface TradeSearchOptions {
	accountId: string | null;
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
	scannedInGameVersionId: string;
}

@Injectable()
export class TradeService {
	public async findAllWhere({
		accountId = null,
		startLocationId,
		endLocationId
	}: TradeSearchOptions): Promise<Trade[]> {
		const from: FromQueryBuilder = select(GLOBAL_STAR).from(f_trade, [cast(accountId, UUID)]);
		const clause: ComparisonOperator[] = [];
		if (startLocationId !== undefined) {
			clause.push(eq(f_trade.buy_location_id, cast(startLocationId, UUID)));
		}
		if (endLocationId !== undefined) {
			clause.push(eq(f_trade.sell_location_id, cast(endLocationId, UUID)));
		}
		const query: QueryBuilder = clause.length > 0 ? from.where(and(clause)) : from;
		const result: QueryResult = await client.query(query.toQuery());
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
			scanTime:
				tradeResult.buyScanTime > tradeResult.sellScanTime ? tradeResult.sellScanTime : tradeResult.buyScanTime,
			scannedInGameVersionId: tradeResult.scannedInGameVersionId
		} as Trade;
	}
}
