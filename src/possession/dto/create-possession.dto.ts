import { IsDate, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { CreatePossessionInput, Date, PurchaseCurrency } from 'src/graphql.schema';

export class CreatePossessionDto implements CreatePossessionInput {
	@IsOptional()
	@IsUUID('4')
	public accountId?: string | undefined;
	@IsUUID('4')
	public itemId!: string;
	@IsNumber()
	@IsPositive()
	public purchasePrice!: number;
	public purchaseCurrency!: PurchaseCurrency;
	@IsOptional()
	@IsDate()
	public purchaseDate?: Date;
}
