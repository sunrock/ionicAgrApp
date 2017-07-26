import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class LocationProvider {

  constructor(public angularfire: AngularFireDatabase) {
    console.log('Location Provider');
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

  // Get all wineries  
  getWineries() {
    return this.angularfire.list('/wineries');     
  }

  getWineryById(wineryId) {
    return this.angularfire.object('/wineries/' + wineryId);
  }

  

}
