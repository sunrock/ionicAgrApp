import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataProvider } from "../../providers/data";
import { AlertProvider } from "../../providers/alert";
import { AngularFireDatabase } from "angularfire2/database";
import { LoadingProvider } from "../../providers/loading";
import { RequestProvider } from "../../providers/request";
import { CusConfig } from "../../support/config";

@IonicPage()
@Component({
  selector: 'page-requests-page',
  templateUrl: 'requests-page.html',
})
export class RequestsPage {

  private reqRcv: any;
  private reqSent: any;
  private alert: any;
  private account: any;

  // RequestsPage
  // This is the page where the user can see their friend requests sent and received.
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public alertCtrl: AlertController, public angularfire: AngularFireDatabase,
              public dataProvider: DataProvider, public loadingProvider: LoadingProvider, 
              public alertProvider: AlertProvider, public requestProvider: RequestProvider) { }

  ionViewDidLoad() {

    this.loadingProvider.show(CusConfig.loadingMsg);
    // Get user info
    this.dataProvider.getCurrentUser().subscribe((account) => {
      this.account = account;
      // Get requestsReceived and requestsSent of the user.
      this.dataProvider.getRequests(this.account.userId).subscribe((requests) => {
        // requestsReceived.
        if (requests.reqRcv) {
          this.reqRcv = [];
          requests.reqRcv.forEach((userId) => {
            this.dataProvider.getUserById(userId).subscribe((sender) => {
              this.addOrUpdateFriendRequest(sender);
            });
          });
        } else {
          this.reqRcv = [];
        }
        // requestsSent.
        if (requests.reqSent) {
          this.reqSent = [];
          requests.reqSent.forEach((userId) => {
            this.dataProvider.getUserById(userId).subscribe((receiver) => {
              this.addOrUpdateRequestSent(receiver);
            });
          });
        } else {
          this.reqSent = [];
        }
        this.loadingProvider.hide();
      });
    });
  }

  // Add or update friend request only if not yet friends.
  addOrUpdateFriendRequest(sender) {
    if (!this.reqRcv) {
      this.reqRcv = [sender];
    } else {
      var index = -1;
      for (var i = 0; i < this.reqRcv.length; i++) {
        if (this.reqRcv[i].$key == sender.$key) {
          index = i;
        }
      }
      if (index > -1) {
        if (!this.isFriends(sender.$key))
          this.reqRcv[index] = sender;
      } else {
        if (!this.isFriends(sender.$key))
          this.reqRcv.push(sender);
      }
    }
  }

  // Add or update requests sent only if the user is not yet a friend.
  addOrUpdateRequestSent(receiver) {
    if (!this.reqSent) {
      this.reqSent = [receiver];
    } else {
      var index = -1;
      for (var i = 0; i < this.reqSent.length; i++) {
        if (this.reqSent[i].$key == receiver.$key) {
          index = i;
        }
      }
      if (index > -1) {
        if (!this.isFriends(receiver.$key))
          this.reqSent[index] = receiver;
      } else {
        if (!this.isFriends(receiver.$key))
          this.reqSent.push(receiver);
      }
    }
  }

  // Back
  back() {
    this.navCtrl.pop();
  }

  // Accept Friend Request.
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

  // Cancel Friend Request sent.
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

  // Checks if user is already friends with this user.
  isFriends(userId) {
    if (this.account.friends) {
      if (this.account.friends.indexOf(userId) == -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // View user.
  viewUser(userId) {
    // this.navCtrl.push(ContactInfoPage, { userId: userId });
  }

}
