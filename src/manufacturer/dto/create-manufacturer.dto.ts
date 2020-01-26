import { Length } from 'class-validator';
import { CreateManufacturerInput } from '../../graphql.schema';

export class CreateManufacturerDto implements CreateManufacturerInput {
  @Length(2)
  public name!: string;
}
