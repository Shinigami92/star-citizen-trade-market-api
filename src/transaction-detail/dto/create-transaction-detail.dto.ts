import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { CreateTransactionDetailInput, TransactionDetailType } from 'src/graphql.schema';

export class CreateTransactionDetailDto implements CreateTransactionDetailInput {
	@IsUUID('4')
	public transactionId!: string;
	public type!: TransactionDetailType;
	@IsOptional()
	@IsUUID('4')
	public locationId?: string | undefined;
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
