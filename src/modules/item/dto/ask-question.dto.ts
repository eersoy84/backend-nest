import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class AskQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  adId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(2048)
  question: string;
}
