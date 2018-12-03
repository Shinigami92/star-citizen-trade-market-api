import { IsDate, IsOptional, IsUUID, Length } from 'class-validator';
import { CreateLocationInput, Date } from 'src/graphql.schema';

export class CreateLocationDto implements CreateLocationInput {
	@Length(3)
	public name!: string;
	@IsOptional()
	@IsUUID('4')
	public parentLocationId?: string;
	@IsUUID('4')
	public typeId!: string;
	@IsUUID('4')
	public inGameSinceVersionId!: string;
	@IsDate()
	public inGameSince?: Date;
}
