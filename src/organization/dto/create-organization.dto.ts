import { Length } from 'class-validator';
import { CreateOrganizationInput } from '../../graphql.schema';

export class CreateOrganizationDto implements CreateOrganizationInput {
	@Length(1, 50)
	public name!: string;
	@Length(3, 10)
	public spectrumId!: string;
}
