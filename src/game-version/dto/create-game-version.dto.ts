import { Length } from 'class-validator';
import { CreateGameVersionInput } from 'src/graphql.schema';

export class CreateGameVersionDto implements CreateGameVersionInput {
	@Length(16, 18)
	public identifier!: string;
	// @IsDate()
	// public releaseTimestamp?: Date;
}
