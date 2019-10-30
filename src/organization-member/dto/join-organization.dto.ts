import { JoinOrganizationInput } from '@/graphql.schema';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class JoinOrganizationDto implements JoinOrganizationInput {
	@IsUUID('4')
	public organizationId!: string;
	@IsOptional()
	@IsUUID('4')
	public accountId?: string | undefined;
	@IsOptional()
	@IsDate()
	public since?: Date;
}
