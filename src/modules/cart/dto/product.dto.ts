import {
  Exclude,
  Expose,
} from 'class-transformer';

import * as moment from 'moment';

export class ProductDto {
  adId: number;
  imageUrl: string;
  numOrders: number;
  quantity: number;

  @Exclude()
  _normalPrice: number;

  normalPriceInt: number;

  @Exclude()
  _instantPrice: number;
  modelId: number;
  brandName: string;
  brandId: number;
  modelName: string;
  categoryName: string;
  categoryId: number;
  sellerId: number;
  sellerName: string;
  sellerLogo: string;
  sellerMarketPlaceName: string;
  description: string;

  @Exclude()
  _date: Date;
  status: string;

  @Expose()
  get date() {
    return moment(this._date)
      .locale('tr')
      .format('Do MMMM YYYY, HH:MM');
  }

  @Expose()
  get instantPrice() {
    return `${(
      this._instantPrice / 100
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  @Expose()
  get normalPrice() {
    return `${(
      this._normalPrice / 100
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
