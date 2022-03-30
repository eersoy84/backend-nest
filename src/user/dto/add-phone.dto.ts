import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddPhoneDto {
  @IsNotEmpty()
  @IsNumber()
  @MinLength(10)
  @MaxLength(14)
  phone: string;
}
