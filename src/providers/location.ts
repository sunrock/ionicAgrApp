import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class LocationProvider {

  constructor(public angularfire: AngularFireDatabase) {
    console.log('Hello Location Provider');
  }

  // Get dummy data: locations
  getLocations() {
    return this.angularfire.list('/dummy/locations');
  }

  // Get all wine regions
  getRegions() {
    return this.angularfire.list('/regions');
  }

  getRegionById(regionId) {
    return this.angularfire.object('/regions/' + regionId);
  }

  getWineries() {
    return this.angularfire.list('/wineries');     
  }

  

}
