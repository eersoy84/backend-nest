import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class RateItemDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(60)
  cartId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  adId: number;

  @IsNotEmpty()
  @IsString()
  @Max(2048)
  comment: string;

  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
