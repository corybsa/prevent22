import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Formatter } from 'src/app/models/formatter';

@Pipe({
  name: 'humanDate'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format: string): any {
    if (!value) {
      return value;
    }

    const date = moment(value);

    if (date.isValid()) {
      switch (format) {
        case 'date':
          return Formatter.getHumanDate(value);
        case 'datetime':
          return Formatter.getHumanDateTime(value);
        case 'datetimeshort':
          return Formatter.getHumanDateTimeNoSeconds(value);
        case 'shortdate':
          return Formatter.getHumanShortDate(value);
        case 'elapsed':
          return Formatter.getElapsedTime(value);
        default:
          return Formatter.format(value, format);
      }
    }

    return value;
  }
}
