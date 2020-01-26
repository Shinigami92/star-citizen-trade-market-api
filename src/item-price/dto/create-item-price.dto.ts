import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { CreateItemPriceInput, ItemPriceType, ItemPriceVisibility } from '../../graphql.schema';

export class CreateItemPriceDto implements CreateItemPriceInput {
  @IsOptional()
  @IsUUID('4')
  public scannedById?: string;
  @IsUUID('4')
  public itemId!: string;
  @IsUUID('4')
  public locationId!: string;
  @IsNumber()
  @IsPositive()
  public price!: number;
  @IsInt()
  @IsPositive()
  public quantity!: number;
  @IsOptional()
  @IsDate()
  public scanTime?: Date;
  public type!: ItemPriceType;
  public visibility?: ItemPriceVisibility;
  @IsOptional()
  @IsUUID('4')
  public scannedInGameVersionId?: string;
}
