import { ProductSpecs } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

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
  parentId: number;
  endDate: Date;
  maxDiscountPercent: number;
  maxParticipants: number;
  minParticipants: number;

  @Exclude()
  _targetPrice: number;

  @Exclude()
  _downpayment: number;

  @Exclude()
  _listingPrice: number;
  specs: ProductSpecs[];
  images: string[];

  @Exclude()
  _instantDiscountPercent: number;

  participants: number;
  createdDate: Date;

  @Expose()
  get instantDiscountPercent() {
    return `${this._instantDiscountPercent.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}`;
  }

  @Expose()
  get targetPrice() {
    return this._targetPrice / 100;
  }

  @Expose()
  get downpayment() {
    return this._downpayment / 100;
  }

  @Expose()
  get isActive() {
    const currentDate = new Date();
    if (currentDate > this.endDate) {
      return false;
    }
    return true;
  }

  @Exclude()
  _date: Date;
  status: string;

  @Expose()
  get date() {
    return moment(this._date).locale('tr').format('Do MMMM YYYY, HH:MM');
  }

  @Expose()
  get listingPrice() {
    return `${(this._listingPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  @Expose()
  get instantPrice() {
    return `${(this._instantPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  @Expose()
  get normalPrice() {
    return `${(this._normalPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
