import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CartRequestDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(60)
  cartId: string;

  @ValidateIf((q) => q.isOrder !== null)
  @IsNumber()
  @Min(1)
  @Max(2)
  @IsOptional()
  isOrder?: number;

  @ValidateIf((q) => q.amount !== null)
  @IsNumber()
  @IsEmpty()
  @IsOptional()
  amount?: number;
}
