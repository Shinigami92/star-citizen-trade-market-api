import { UpdateManufacturerInput } from '@/graphql.schema';
import { IsOptional, Length } from 'class-validator';

export class UpdateManufacturerDto implements UpdateManufacturerInput {
	@IsOptional()
	@Length(2)
	public name?: string;
}
