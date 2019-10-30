import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { CreateFirstTransactionDetailInput, CreateTransactionInput } from 'src/graphql.schema';

export class CreateFirstTransactionDetailDto implements CreateFirstTransactionDetailInput {
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

export class CreateTransactionDto implements CreateTransactionInput {
	@IsOptional()
	@IsUUID('4')
	public accountId?: string | undefined;
	@IsUUID('4')
	public commodityId!: string;
	public transactionDetail!: CreateFirstTransactionDetailDto;
}
