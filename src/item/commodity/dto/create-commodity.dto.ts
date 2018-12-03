import { IsDate, IsUUID, Length } from 'class-validator';
import { CreateCommodityInput, Date } from 'src/graphql.schema';

export class CreateCommodityDto implements CreateCommodityInput {
	@Length(3)
	public name!: string;
	@IsUUID('4')
	public inGameSinceVersionId!: string;
	@IsDate()
	public inGameSince?: Date;
	@IsUUID('4')
	public commodityCategoryId!: string;
}