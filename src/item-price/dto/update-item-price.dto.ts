import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { Date, ItemPriceType, ItemPriceVisibility, UpdateItemPriceInput } from 'src/graphql.schema';

export class UpdateItemPriceDto implements UpdateItemPriceInput {
	@IsOptional()
	@IsUUID('4')
	public scannedById?: string;
	@IsOptional()
	@IsUUID('4')
	public itemId?: string;
	@IsOptional()
	@IsUUID('4')
	public locationId?: string;
	@IsOptional()
	@IsNumber()
	@IsPositive()
	public price?: number;
	@IsOptional()
	@IsInt()
	@IsPositive()
	public quantity?: number;
	@IsOptional()
	@IsDate()
	public scanTime?: Date;
	@IsOptional()
	public type?: ItemPriceType;
	@IsOptional()
	public visibility?: ItemPriceVisibility;
	@IsOptional()
	@IsUUID('4')
	public scannedInGameVersionId?: string;
}
