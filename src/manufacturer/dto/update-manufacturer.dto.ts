import { IsOptional, Length } from 'class-validator';
import { UpdateManufacturerInput } from '../../graphql.schema';

export class UpdateManufacturerDto implements UpdateManufacturerInput {
	@IsOptional()
	@Length(2)
	public name?: string;
}
