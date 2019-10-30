import { CreateShipInput } from '@/graphql.schema';
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsUUID, Length } from 'class-validator';

export class CreateShipDto implements CreateShipInput {
	@Length(3)
	public name!: string;
	@IsUUID('4')
	public inGameSinceVersionId!: string;
	@IsDate()
	public inGameSince?: Date;
	@IsInt()
	@IsPositive()
	public scu!: number;
	@IsUUID('4')
	public manufacturerId!: string;
	@IsNotEmpty()
	public focus!: string;
	@IsInt()
	@IsPositive()
	public size!: number;
}
