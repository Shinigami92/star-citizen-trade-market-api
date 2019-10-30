import { CreateTransactionInput } from '@/graphql.schema';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateFirstTransactionDetailDto } from './create-first-transaction-detail.dto';

export class CreateTransactionDto implements CreateTransactionInput {
	@IsOptional()
	@IsUUID('4')
	public accountId?: string | undefined;
	@IsUUID('4')
	public commodityId!: string;
	public transactionDetail!: CreateFirstTransactionDetailDto;
}
