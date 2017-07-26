import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { CusConfig } from "../../support/config";
// providers
import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";
import { AlertProvider } from "../../providers/alert";
import { RequestProvider } from "../../providers/request";

import { ContactInfoPage } from "../contact-info-page/contact-info-page";

@IonicPage()
@Component({
  selector: 'page-contact-search-page',
  templateUrl: 'contact-search-page.html',
})
export class ContactSearchPage implements OnInit {

  private accounts: any;
  private alert: any;
  private account: any;
  private excludedIds: any;
  private reqSent: any;
  private reqRcv: any;
  private searchUser: any;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public angularfire: AngularFireDatabase, 
              public dataProvider: DataProvider, 
              public loadingProvider: LoadingProvider,
              public alertCtrl: AlertController, 
              public alertProvider: AlertProvider, 
              public requestProvider: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactSearchPage');
    this.searchUser = '';
  }

  ngOnInit() {
    this.loadingProvider.show(CusConfig.loadingMsg);
    // Get all users.
    this.dataProvider.getUsers().subscribe((accounts) => {
      this.loadingProvider.hide();
      this.accounts = accounts;
      this.dataProvider.getCurrentUser().subscribe((account) => {
        // Add own userId as exludedIds.
        this.excludedIds = [];
        this.account = account;
        if (this.excludedIds.indexOf(account.$key) == -1) {
          this.excludedIds.push(account.$key);
        }
        // Get contacts which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        if (account.contacts) {
          account.contacts.forEach(contact => {
            if (this.excludedIds.indexOf(contact) == -1) {
              this.excludedIds.push(contact);
            }
          });
        }
        // Get requests of the currentUser.
        this.dataProvider.getRequests(account.$key).subscribe((requests) => {
          this.reqSent = requests.reqSent;
          this.reqRcv = requests.reqRcv;
        });
      });
    });
  }

    // Back
  back() {
    this.navCtrl.pop();
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.reqSent) {
      for (var i = 0; i < this.reqSent.length; i++) {
        if (this.reqSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.reqRcv) {
      for (var j = 0; j < this.reqRcv.length; j++) {
        if (this.reqRcv[j] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

    // Send friend request.
  sendFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.requestProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.requestProvider.cancelFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Accept friend request.
  acceptFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject Request',
          handler: () => {
            this.requestProvider.deleteFriendRequest(user.$key);
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.requestProvider.acceptFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // View user.
  viewUser(userId) {
    this.navCtrl.push(ContactInfoPage, {userId: userId});
  }

}
