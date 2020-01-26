import { IsOptional, Length } from 'class-validator';
import { UpdateLocationTypeInput } from '../../graphql.schema';

export class UpdateLocationTypeDto implements UpdateLocationTypeInput {
  @IsOptional()
  @Length(3)
  public name?: string;
}
