import { IsDate, IsOptional, IsUUID, Length } from 'class-validator';
import { UpdateCommodityInput } from '@/graphql.schema';

export class UpdateCommodityDto implements UpdateCommodityInput {
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
	@IsUUID('4')
	public commodityCategoryId?: string;
}
