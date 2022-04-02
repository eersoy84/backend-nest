import {
  Exclude,
  Expose,
} from 'class-transformer';

import * as moment from 'moment';
import { ProductDto } from './product.dto';
import { ReturnsDto } from './returns.dto';

export class UserCartItemResponseDto {
  readonly id?: number;
  readonly adId?: number;
  readonly cartId?: string;
  readonly reviewAvailable: boolean;
  readonly amount: number;
  readonly returnableAmount: number;
  readonly deliveryStatus: string;
  readonly returns: ReturnsDto[];
  readonly product: ProductDto;

  @Exclude()
  readonly _totalPrice: number;

  @Exclude()
  readonly _profit?: number;

  @Exclude()
  readonly _dateCreated?: Date;

  readonly status?: string;
  readonly shippingId?: number;

  @Expose()
  get profit() {
    return `${this._profit?.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}${' '}₺`;
  }

  @Expose()
  get totalPrice() {
    return `${this._totalPrice?.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}${' '}₺`;
  }

  @Expose()
  get dateCreated() {
    return moment(this._dateCreated)
      .locale('tr')
      .format('Do MMMM YYYY, HH:MM');
  }

  constructor(
    partial: Partial<UserCartItemResponseDto>,
  ) {
    Object.assign(this, partial);
  }
}
