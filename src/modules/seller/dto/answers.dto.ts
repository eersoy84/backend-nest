import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AnswerQuestionDto } from './answer-question.dto';

export class AnswersDto {
  @IsArray()
  @Type(() => AnswerQuestionDto)
  @ValidateNested()
  answers: AnswerQuestionDto[];
}
