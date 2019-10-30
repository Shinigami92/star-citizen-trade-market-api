import { CreateLocationInput } from '@/graphql.schema';
import { IsBoolean, IsDate, IsOptional, IsUUID, Length } from 'class-validator';

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
	@IsOptional()
	@IsBoolean()
	public canTrade?: boolean;
}
