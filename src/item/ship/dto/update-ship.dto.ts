import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID, Length } from 'class-validator';
import { UpdateShipInput } from 'src/graphql.schema';

export class UpdateShipDto implements UpdateShipInput {
	@IsOptional()
	@Length(3)
	public name?: string;
	@IsOptional()
	@IsUUID('4')
	public inGameSinceVersionId?: string;
	@IsOptional()
	@IsDate()
	public inGameSince?: Date;
	@IsOptional()
	@IsInt()
	@IsPositive()
	public scu?: number;
	@IsOptional()
	@IsUUID('4')
	public manufacturerId?: string;
	@IsOptional()
	@IsNotEmpty()
	public focus?: string;
	@IsOptional()
	@IsInt()
	@IsPositive()
	public size?: number;
}
