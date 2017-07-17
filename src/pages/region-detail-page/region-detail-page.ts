import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from "../../providers/location";

@IonicPage()
@Component({
  selector: 'page-region-detail-page',
  templateUrl: 'region-detail-page.html',
})
export class RegionDetailPage {

  region: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public locationProvider: LocationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegionDetailPage');
  }

  ngOnInit() {
    let regionId = this.navParams.get('regionId');
    this.locationProvider.getRegionById(regionId).subscribe(
      (region) => {
        this.region = region;
      }
    );
  }

}
