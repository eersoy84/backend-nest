import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CancelProductDto {
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @IsNotEmpty()
  @Max(2048)
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  reasonId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  returnAmount: number;
}
