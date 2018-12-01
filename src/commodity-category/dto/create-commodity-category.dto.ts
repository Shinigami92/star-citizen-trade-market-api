import { Length } from 'class-validator';
import { CreateCommodityCategoryInput } from 'src/graphql.schema';

export class CreateCommodityCategoryDto implements CreateCommodityCategoryInput {
	@Length(3)
	public name!: string;
}
