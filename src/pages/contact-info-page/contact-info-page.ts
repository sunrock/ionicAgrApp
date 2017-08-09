import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";
import { RequestProvider } from "../../providers/request";
import { CusConfig } from "../../support/config";
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-contact-info-page',
  templateUrl: 'contact-info-page.html',
})
export class ContactInfoPage {

  private user: any;
  private userId: any;
  private reqRcv: any;
  private reqSent: any;
  private contacts: any;
  private alert: any;
  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public modalCtrl: ModalController, public alertCtrl: AlertController,
              public dataProvider: DataProvider,
              public loadingProvider: LoadingProvider, 
              public requestProvider: RequestProvider) { }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    this.loadingProvider.show(CusConfig.loadingMsg);
    // Get user info.
    this.dataProvider.getUserById(this.userId).subscribe((user) => {
      this.user = user;
      this.loadingProvider.hide();
    });
    // Get contacts of current logged in user.
    this.dataProvider.getUserById(firebase.auth().currentUser.uid).subscribe((user) => {
      this.contacts = user.contacts;
    });
    // Get requests of current logged in user.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests) => {
      this.reqRcv = requests.reqRcv;
      this.reqSent = requests.reqSent;
    });
  }

  // Accept friend request.
  acceptFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Accept',
          handler: () => {
            this.requestProvider.acceptFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Deny friend request.
  rejectFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Reject Friend Request',
      message: 'Do you want to reject <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject',
          handler: () => {
            this.requestProvider.deleteFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.requestProvider.cancelFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Send friend request.
  sendFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.requestProvider.sendFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.reqRcv) {
      if (this.reqRcv.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.reqSent) {
      if (this.reqSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.contacts) {
      if (this.contacts.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }

  // Back
  back() {
    this.navCtrl.pop();
  }

  // Enlarge user's profile image.
  enlargeImage(img) {
    // let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    // imageModal.present();
  }

  // Open chat with this user.
  sendMessages() {
  //   this.navCtrl.push(MessagePage, { userId: this.userId });
  }

}
