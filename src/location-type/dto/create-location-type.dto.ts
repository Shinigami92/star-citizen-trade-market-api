import { CreateLocationTypeInput } from '@/graphql.schema';
import { Length } from 'class-validator';

export class CreateLocationTypeDto implements CreateLocationTypeInput {
	@Length(3)
	public name!: string;
}
