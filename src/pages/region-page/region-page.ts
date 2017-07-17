import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { CusConfig } from "../../support/config";
import { AngularFireDatabase } from "angularfire2/database";
import { LoadingProvider } from "../../providers/loading";
import { LogoutProvider } from "../../providers/logout";
import { DataProvider } from "../../providers/data";

@IonicPage()
@Component({
  selector: 'page-region-page',
  templateUrl: 'region-page.html',
})
export class RegionPage {

  private user: any;
  private alert;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private angularfire: AngularFireDatabase,
              private alertCtrl: AlertController,
              private loadingProvider: LoadingProvider,
              private logoutProvider: LogoutProvider,
              private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.loadingProvider.show(CusConfig.loadingMsg);
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = user;
    });

    if(firebase.auth().currentUser != null || firebase.auth().currentUser != undefined ){
      // update token
      this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({
        pushToken: localStorage.getItem('pushToken')
      });

      this.loadingProvider.hide();
    }
  }

  // Log out the current account.
  logout() {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: data => { this.logoutProvider.logout(); }
        }
      ]
    }).present();
  }

}
