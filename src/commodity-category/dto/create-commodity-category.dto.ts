import { Length } from 'class-validator';
import { CreateCommodityCategoryInput } from '../../graphql.schema';

export class CreateCommodityCategoryDto implements CreateCommodityCategoryInput {
	@Length(3)
	public name!: string;
}
