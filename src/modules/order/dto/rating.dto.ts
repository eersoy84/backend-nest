import { IsIn, IsNumber, Validate } from 'class-validator';
import { CustomRatingValidation } from '../validator/custom-rating-validation';

export class Rating {
  @IsNumber()
  @IsIn([1, 3, 4, 5])
  id: number;

  @Validate(CustomRatingValidation)
  value: number | string;
}
