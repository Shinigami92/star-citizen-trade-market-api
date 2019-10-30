import { CreateManufacturerInput } from '@/graphql.schema';
import { Length } from 'class-validator';

export class CreateManufacturerDto implements CreateManufacturerInput {
	@Length(2)
	public name!: string;
}
