import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from "../../providers/location";

@IonicPage()
@Component({
  selector: 'page-winery-detail-page',
  templateUrl: 'winery-detail-page.html',
})
export class WineryDetailPage {

  private region: any;
  private winery: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public locationProvider: LocationProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WineryDetailPage');
  }

  ngOnInit() {
    let regionId = this.navParams.get('regionId');
    let wineryId = this.navParams.get('wineryId');    
    this.locationProvider.getRegionById(regionId).subscribe(
      (region) => {
        this.region = region;
      }
    );
    this.locationProvider.getWineryById(wineryId).subscribe(
      (winery) => {
        this.winery = winery;
      }
    )
  }

}
