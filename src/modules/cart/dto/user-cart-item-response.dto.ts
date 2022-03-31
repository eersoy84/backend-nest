import { Exclude } from 'class-transformer';

export class UserCartItemResponseDto {
  @Exclude()
  id: number;
}
