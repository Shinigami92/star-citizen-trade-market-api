import { AliasReference, ColumnDefinition, FunctionDefinition, UUID } from '@shinigami92/pg-query-builder';

class TradeFunction extends FunctionDefinition {
	public readonly buy_location_id: ColumnDefinition = new ColumnDefinition('buy_location_id', UUID);
	public readonly sell_location_id: ColumnDefinition = new ColumnDefinition('sell_location_id', UUID);

	constructor(alias?: AliasReference) {
		super('f_trade', [UUID], alias);
	}
}

export const f_trade: TradeFunction = new TradeFunction();
