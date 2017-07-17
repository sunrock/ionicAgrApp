import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  // DatePipe
  // Show moment.js dateFormat for time elapsed.
  transform(date: any, args?: any): any {
    return moment(new Date(date)).fromNow();
  }
}