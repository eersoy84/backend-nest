import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class AnswerQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2048)
  sellerAnswer: string;
}
