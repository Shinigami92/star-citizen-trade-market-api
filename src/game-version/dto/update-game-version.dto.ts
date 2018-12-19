import { IsDate, IsOptional, Length } from 'class-validator';
import { Date, UpdateGameVersionInput } from 'src/graphql.schema';

export class UpdateGameVersionDto implements UpdateGameVersionInput {
	@IsOptional()
	@Length(16, 18)
	public identifier?: string;
	@IsOptional()
	@IsDate()
	public release?: Date;
}
