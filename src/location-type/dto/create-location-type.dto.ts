import { Length } from 'class-validator';
import { CreateLocationTypeInput } from 'src/graphql.schema';

export class CreateLocationTypeDto implements CreateLocationTypeInput {
	@Length(3)
	public name!: string;
}
