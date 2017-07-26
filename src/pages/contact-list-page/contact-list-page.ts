import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { CusConfig } from "../../support/config";

// providers
import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";

// pages
import { ContactSearchPage } from "../contact-search-page/contact-search-page";
import { RequestsPage } from "../requests-page/requests-page";


@IonicPage()
@Component({
  selector: 'page-contact-list-page',
  templateUrl: 'contact-list-page.html',
})
export class ContactListPage implements OnInit{

  private contacts: any;
  private reqRcv: any;
  private searchContactName: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingProvider: LoadingProvider,
              public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
    this.searchContactName = '';
  }

  ngOnInit() {
    this.loadingProvider.show(CusConfig.loadingMsg);

    // Get received requests to show reqRsv count.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests) => {
      this.reqRcv = requests.reqRcv;
    });

    // Get user data on database and get list of contacts.
    this.dataProvider.getCurrentUser().subscribe((account) => {
      if (account.contacts) {
        for (var i = 0; i < account.contacts.length; i++) {
          this.dataProvider.getUserById(account.contacts[i]).subscribe((friend) => {
            this.addOrUpdateContact(friend);
          });
        }
      } else {
        this.contacts = [];
      }
      this.loadingProvider.hide();
    });

  }


    // Add or update contacts data for real-time sync.
  addOrUpdateContact(newFriend) {
    if (!this.contacts) {
      this.contacts = [newFriend];
    } else {
      var index = -1;
      for (var i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].$key == newFriend.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.contacts[index] = newFriend;
      } else {
        this.contacts.push(newFriend);
      }
    }
  }

  // Proceed to searchPeople page.
  searchPeople() {
    this.navCtrl.push(ContactSearchPage);
  }

  // Proceed to requests page.
  manageRequests() {
    this.navCtrl.push(RequestsPage);
  }

  // // Proceed to chat page.
  sendMessages(userId) {
    // this.app.getRootNav().push(MessagePage, { userId: userId });
  }

}
