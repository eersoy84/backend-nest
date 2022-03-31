import {
  Exclude,
  Expose,
} from 'class-transformer';

import * as moment from 'moment';

export class UserCartInfoResponseDto {
  readonly id?: number;
  readonly uuid?: string;
  readonly subTotal?: number;

  @Exclude()
  readonly _totalProfit?: number;

  readonly invoiceId?: number;

  @Exclude()
  readonly _dateCreated?: Date;

  readonly status?: string;
  readonly shippingId?: number;

  @Expose()
  get totalProfit() {
    return `${this._totalProfit?.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}${' '}₺`;
  }

  @Expose()
  get datePassed() {
    return moment(this._dateCreated)
      .locale('tr')
      .fromNow();
  }

  @Expose()
  get dateCreated() {
    return moment(this._dateCreated)
      .locale('tr')
      .format('Do MMMM YYYY, HH:MM');
  }

  constructor(
    partial: Partial<UserCartInfoResponseDto>,
  ) {
    Object.assign(this, partial);
  }
}
