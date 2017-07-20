import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regionFilter',
})
export class RegionPipe implements PipeTransform {
  // RegionPipe
  // Filter regions by region name.
  transform(regions: any[], search: string): any {
    if (!regions) {
      return;
    } else if (!search) {
      return regions;
    } else {
      let term = search.toLowerCase();
      return regions.filter(
        region => region.name.toLowerCase().indexOf(term) > -1
      );
    }
  }
}
