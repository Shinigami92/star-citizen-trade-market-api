import { IsDate, IsOptional, IsUUID, Length } from 'class-validator';
import { Date, UpdateLocationInput } from 'src/graphql.schema';

export class UpdateLocationDto implements UpdateLocationInput {
	@IsOptional()
	@Length(3)
	public name?: string;
	@IsOptional()
	@IsUUID('4')
	public parentLocationId?: string;
	@IsOptional()
	@IsUUID('4')
	public typeId?: string;
	@IsOptional()
	@IsUUID('4')
	public inGameSinceVersionId?: string;
	@IsOptional()
	@IsDate()
	public inGameSince?: Date;
}