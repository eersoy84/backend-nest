import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, Min, MinLength, Validate, ValidateIf, ValidateNested } from 'class-validator';
import { Rating } from './rating.dto';

export class RateSellerDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(60)
  cartId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sellerId: number;

  @IsArray()
  @Type(() => Rating)
  @ValidateNested()
  ratings: Rating[];
}
