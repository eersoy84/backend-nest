import { Exclude, Expose } from 'class-transformer';
import * as moment from 'moment';

export class QuestionDto {
  id: number;
  userId: number;
  productId: number;
  userQuestion: string;
  sellerAnswer: string;
  questionApproved: number;
  answerApproved: number;

  @Exclude()
  _userQuestionDate: string;

  @Expose()
  get userQuestionDate() {
    if (!this._userQuestionDate) return;
    return moment(this._userQuestionDate).locale('tr').format('Do MMMM YYYY, HH:MM');
  }

  set userQuestionDate(value) {
    this._userQuestionDate = value;
  }

  @Exclude()
  _sellerAnswerDate: string;

  @Expose()
  get sellerAnswerDate() {
    if (!this._sellerAnswerDate) return;

    return moment(this._sellerAnswerDate).locale('tr').format('Do MMMM YYYY, HH:MM');
  }

  set sellerAnswerDate(value) {
    this._sellerAnswerDate = value;
  }

  constructor(partial: Partial<QuestionDto | any>) {
    Object.assign(this, partial);
  }
}
