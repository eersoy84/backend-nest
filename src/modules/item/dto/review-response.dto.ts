import {
  ProductReviews,
  users,
} from '@prisma/client';
import {
  Exclude,
  Expose,
} from 'class-transformer';
import * as moment from 'moment';

export class ReviewResponseDto {
  readonly id?: number;
  readonly content?: string;
  readonly star?: number;

  @Exclude()
  readonly reviewDate?: Date;

  @Exclude()
  readonly firstName?: string;

  @Exclude()
  readonly lastName?: string;

  @Expose()
  get userName() {
    let firstName = this.firstName.replace(
      this.firstName.slice(1, -1),
      '***',
    );
    let lastName = this.lastName.replace(
      this.lastName.slice(1, -1),
      '***',
    );
    return `${firstName} ${lastName}`;
  }

  @Expose()
  get date() {
    if (this.reviewDate)
      return moment(this.reviewDate)
        .locale('tr')
        .format('Do MMMM YYYY, HH:MM');
    else return null;
  }

  constructor(
    partial: Partial<ReviewResponseDto>,
  ) {
    Object.assign(this, partial);
  }
}
