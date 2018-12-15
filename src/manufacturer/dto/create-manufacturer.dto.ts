import { Length } from 'class-validator';
import { CreateManufacturerInput } from 'src/graphql.schema';

export class CreateManufacturerDto implements CreateManufacturerInput {
	@Length(2)
	public name!: string;
}
