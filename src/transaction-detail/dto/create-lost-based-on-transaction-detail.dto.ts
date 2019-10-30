import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateLostBasedOnTransactionDetailInput } from 'src/graphql.schema';

export class CreateLostBasedOnTransactionDetailDto implements CreateLostBasedOnTransactionDetailInput {
	@IsUUID('4')
	public transactionDetailId!: string;
	@IsOptional()
	@IsUUID('4')
	public locationId?: string | undefined;
	@IsOptional()
	@IsString()
	public note?: string | undefined;
	@IsOptional()
	@IsDate()
	public timestamp?: Date;
}
