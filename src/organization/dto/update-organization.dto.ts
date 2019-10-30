import { UpdateOrganizationInput } from '@/graphql.schema';
import { IsOptional, Length } from 'class-validator';

export class UpdateOrganizationDto implements UpdateOrganizationInput {
	@IsOptional()
	@Length(1, 50)
	public name?: string;
	@IsOptional()
	@Length(3, 10)
	public spectrumId?: string;
}
