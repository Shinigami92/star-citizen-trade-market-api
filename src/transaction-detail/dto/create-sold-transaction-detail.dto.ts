import { CreateSoldTransactionDetailInput } from '@/graphql.schema';
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateSoldTransactionDetailDto implements CreateSoldTransactionDetailInput {
	@IsUUID('4')
	public transactionId!: string;
	@IsUUID('4')
	public locationId!: string;
	@IsNumber()
	@IsPositive()
	public price!: number;
	@IsInt()
	@IsPositive()
	public quantity!: number;
	@IsOptional()
	@IsString()
	public note?: string | undefined;
	@IsOptional()
	@IsDate()
	public timestamp?: Date;
}
