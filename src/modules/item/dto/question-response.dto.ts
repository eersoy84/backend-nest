import { users } from '@prisma/client';
import {
  Exclude,
  Expose,
} from 'class-transformer';
import * as moment from 'moment';

export class QuestionResponseDto {
  readonly id?: number;
  readonly question?: string;
  readonly answer?: string;
  readonly star?: number;

  @Exclude()
  readonly _questionDate?: Date;

  @Exclude()
  readonly _answerDate?: Date;

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
  get questionDate() {
    if (this._questionDate)
      return moment(this._questionDate)
        .locale('tr')
        .format('Do MMMM YYYY, HH:MM');
    else return null;
  }

  @Expose()
  get answerDate() {
    if (this._answerDate)
      return moment(this._answerDate)
        .locale('tr')
        .format('Do MMMM YYYY, HH:MM');
    else return null;
  }
  constructor(
    partial: Partial<QuestionResponseDto>,
  ) {
    Object.assign(this, partial);
  }
}
