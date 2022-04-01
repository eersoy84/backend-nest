import {
  Exclude,
  Expose,
} from 'class-transformer';
import * as moment from 'moment';

export class ReturnsDto {
  id: number;
  returnAmount: number;
  @Exclude()
  _date: Date;
  status: string;

  @Expose()
  get date() {
    return moment(this._date)
      .locale('tr')
      .format('Do MMMM YYYY, HH:MM');
  }
}
