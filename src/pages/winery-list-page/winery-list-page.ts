import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from "../../providers/location";

@IonicPage()
@Component({
  selector: 'page-winery-list-page',
  templateUrl: 'winery-list-page.html',
})
export class WineryListPage implements OnInit {

  private wineries: any[];
  private searchWinery: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationProvider: LocationProvider) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WineryListPage');
    this.searchWinery = '';
  }
  
  ngOnInit(): void {
    this.locationProvider.getWineries().subscribe(
      (wineryList) => {
        this.wineries = wineryList;
      }
    );
  }

}
