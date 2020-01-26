import { IsDate, IsOptional, Length } from 'class-validator';
import { CreateGameVersionInput } from '../../graphql.schema';

export class CreateGameVersionDto implements CreateGameVersionInput {
  @Length(16, 18)
  public identifier!: string;
  @IsOptional()
  @IsDate()
  public release?: Date;
}
