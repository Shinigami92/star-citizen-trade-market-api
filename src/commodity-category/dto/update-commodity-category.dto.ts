import { IsOptional, Length } from 'class-validator';
import { UpdateCommodityCategoryInput } from '@/graphql.schema';

export class UpdateCommodityCategoryDto implements UpdateCommodityCategoryInput {
	@IsOptional()
	@Length(3)
	public name?: string;
}
