import { UpdateLocationTypeInput } from '@/graphql.schema';
import { IsOptional, Length } from 'class-validator';

export class UpdateLocationTypeDto implements UpdateLocationTypeInput {
	@IsOptional()
	@Length(3)
	public name?: string;
}
