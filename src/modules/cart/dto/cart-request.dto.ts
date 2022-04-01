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
  validate,
  Validate,
  ValidateIf,
} from 'class-validator';

export class CartRequestDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(60)
  public cartId: string;

  // @ValidateIf((q) => q.isOrder !== null)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  isOrder?: number;

  // @ValidateIf((q) => q.amount !== null)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  amount?: number;
}
