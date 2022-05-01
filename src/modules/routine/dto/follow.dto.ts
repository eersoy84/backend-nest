import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
