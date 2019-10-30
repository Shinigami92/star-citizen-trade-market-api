import { CreateLostTransactionDetailInput } from '@/graphql.schema';
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateLostTransactionDetailDto implements CreateLostTransactionDetailInput {
	@IsUUID('4')
	public transactionId!: string;
	@IsOptional()
	@IsUUID('4')
	public locationId?: string;
	@IsNumber()
	@IsPositive()
	public price!: number;
	@IsInt()
	@IsPositive()
	public quantity!: number;
	@IsOptional()
	@IsString()
	public note?: string;
	@IsOptional()
	@IsDate()
	public timestamp?: Date;
}
