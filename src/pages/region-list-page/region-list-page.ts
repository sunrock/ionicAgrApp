import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from "../../providers/location";
import { RegionDetailPage } from "../region-detail-page/region-detail-page";

@IonicPage()
@Component({
  selector: 'page-region-list-page',
  templateUrl: 'region-list-page.html',
})
export class RegionListPage {

  regions: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public locationProvider: LocationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegionListPage');
  }

  ngOnInit() {
    this.locationProvider.getRegions().subscribe(
      (regionList) => {
        this.regions = regionList;
      }
    );
  }

  showRegionDetails(regionKey) {
    this.navCtrl.push(RegionDetailPage, { regionId: regionKey});
  }

}
