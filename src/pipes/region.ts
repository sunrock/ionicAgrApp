import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regionFilter',
})
export class RegionPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return value.toLowerCase();
  }
}
