import { Exclude } from 'class-transformer';
import { ReturnsDto } from './returns.dto';
import { UserCartInfoResponseDto } from './user-cart-info-response.dto';
import { UserCartItemResponseDto } from './user-cart-item-response.dto';

export class UserCartResponseDto {
  info: UserCartInfoResponseDto;
  items: UserCartItemResponseDto[];
  taxes: any[];
  ratings: any[];

  constructor(
    partial: Partial<UserCartResponseDto>,
  ) {
    Object.assign(this, partial);
  }
}
