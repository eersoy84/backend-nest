import { ProductSpecs } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmpty } from 'class-validator';

import { QuestionDto } from 'src/modules/seller/dto';

export class ProductDto {
  @Exclude()
  id: number;

  @Expose()
  get adId() {
    return this.id;
  }

  set adId(value) {
    this.id = value;
  }
  // adId: number;
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
  _targetPrice?: number;

  @Exclude()
  _downpayment: number;

  @Exclude()
  _listingPrice: number;

  specs: ProductSpecs[];
  images: string[];
  numOfAskedQuestions: number;
  answeredQuestions: QuestionDto[];
  nonAnsweredQuestions: QuestionDto[];

  @Exclude()
  _instantDiscountPercent: number;

  participants: number;
  createdDate: Date;

  @Expose()
  get instantDiscountPercent() {
    return `${this._instantDiscountPercent.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  set instantDiscountPercent(value) {
    this._instantDiscountPercent = parseInt(value);
  }

  @Expose()
  get targetPrice() {
    if (!this._targetPrice) return;
    return this._targetPrice / 100;
  }

  set targetPrice(value) {
    this._targetPrice = value;
  }

  @Expose()
  get downpayment() {
    if (!this._downpayment) return;
    return this._downpayment / 100;
  }
  set downpayment(value) {
    this._downpayment = value;
  }

  @Expose()
  get isActive() {
    if (!this.endDate) return;
    const currentDate = new Date();
    if (currentDate > this.endDate) {
      return false;
    }
    return true;
  }
  status: string;

  @Expose()
  get listingPrice() {
    if (!this._listingPrice) return;
    return `${(this._listingPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  set listingPrice(value) {
    this._listingPrice = parseInt(value);
  }

  @Expose()
  get instantPrice() {
    if (!this._instantPrice) return;
    return `${(this._instantPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  set instantPrice(value) {
    this._instantPrice = parseInt(value);
  }

  @Expose()
  get normalPrice() {
    if (!this._normalPrice) return;
    return `${(this._normalPrice / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${' '}₺`;
  }

  set normalPrice(value) {
    this._normalPrice = parseInt(value);
  }

  constructor(partial: Partial<ProductDto | any>) {
    Object.assign(this, partial);
  }
}
