import { IsDateString, IsUUID, Length } from 'class-validator';
import { CreateCommodityInput } from 'src/graphql.schema';

export class CreateCommodityDto implements CreateCommodityInput {
	@Length(3)
	public name!: string;
	@IsUUID('4')
	public inGameSinceVersionId!: string;
	@IsDateString()
	public inGameSince?: string;
	@IsUUID('4')
	public commodityCategoryId!: string;
}
