import { Component } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";
import { AngularFireDatabase } from "angularfire2/database";

import { CusConfig } from "../../support/config";
import * as firebase from 'firebase';

// pages
import { DiscoverPage } from "../discover-page/discover-page";
import { RegionListPage } from "../region-list-page/region-list-page";
import { ContactListPage } from "../contact-list-page/contact-list-page";
import { ProfilePage } from "../profile-page/profile-page";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RegionListPage;
  tab2Root = DiscoverPage;
  // tab3Root = ProfilePage;
  tab4Root = ContactListPage;
  tab5Root = ProfilePage;
  

  // params
  private reqRcvCount: any;
  private unreadMsgCount: any;
  private chatsInfo: any;
  private chatList: any;

  private groupsInfo: any;
  private groupList: any;

  private unreadGroupMsgCount: any;

  // TabsPage
  // This is the page where we set our tabs.
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public dataProvider: DataProvider,
              public loadingProvider: LoadingProvider,
              public angularfire: AngularFireDatabase) {
    
  }

  ionViewDidLoad() {
    // Create userData on the database if it doesn't exist yet.
    if(firebase.auth().currentUser != null || firebase.auth().currentUser != undefined){
      this.createUser();
    }

    // Get friend requests count.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests) => {
      if (requests.reqRcv) {
        this.reqRcvCount = requests.reqRcv.length;
      } else {
        this.reqRcvCount = null;
      }
    });

    // Get conversations and add/update if the conversation exists, otherwise delete from list.
    this.dataProvider.getChats().subscribe((conversations) => {
      this.unreadMsgCount = null;
      this.chatsInfo = null;
      this.chatList = null;
      if (conversations.length > 0) {
        this.chatsInfo = conversations;
        conversations.forEach((conversation) => {
          this.dataProvider.getChatById(conversation.chatId).subscribe((chat) => {
            if (chat.$exists()) {
              this.addOrUpdateChat(chat);
            }
          });
        });
      }
    });

    this.dataProvider.getGroups().subscribe((groups) => {
      if (groups.length > 0) {
        this.groupsInfo = groups;
        if (this.groupList && this.groupList.length > groups.length) {
          // If the User left/deleted a group, clear the list &
          // add or update each group again.
          this.groupList = null;
        }
        groups.forEach((group) => {
          this.dataProvider.getGroup(group.$key).subscribe((group) => {
            if (group.$exists()) {
              this.addOrUpdateGroup(group);
            }
          });
        });
      } else {
        // groupList does not exist
        this.unreadGroupMsgCount = null;
        this.groupsInfo = null;
        this.groupList = null;
      }
    });
  }

  // Add or update chat for real-time sync of unreadMsgCount.
  addOrUpdateChat(chat) {
    // if chatList is null
    if (!this.chatList) {
      this.chatList = [chat];
    } else {
      var index = -1;
      for (var i = 0; i < this.chatList.length; i++) {
        if (this.chatList[i].$key == chat.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.chatList[index] = chat;
      } else {
        this.chatList.push(chat);
      }
    }
    this.computeUnreadMsgCount();
  }

  addOrUpdateGroup(group) {
    // if groupList is null
    if (!this.groupList) {
      this.groupList = [group];
    } else {
      var index = -1;
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].$key == group.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupList[index] = group;
      } else {
        this.groupList.push(group);
      }
    }
    this.computeUnreadGroupMsgCount();
  }

  computeUnreadMsgCount() {
    this.unreadMsgCount = 0;
    if (this.chatList) {
      for (var i = 0; i < this.chatList.length; i++) {
        this.unreadMsgCount += this.chatList[i].messages.length - this.chatsInfo[i].messagesRead;
        if (this.unreadMsgCount == 0) {
          this.unreadMsgCount = null;
        }
      }
    }
  }

  computeUnreadGroupMsgCount() {
    this.unreadGroupMsgCount = 0;
    if (this.groupList) {
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].messages) {
          this.unreadGroupMsgCount += this.groupList[i].messages.length - this.groupsInfo[i].messagesRead;
        }
        if (this.unreadGroupMsgCount == 0) {
          this.unreadGroupMsgCount = null;
        }
      }
    }
  }

  getUnreadMsgCount() {
    if (this.unreadMsgCount) {
      if (this.unreadMsgCount > 0) {
        return this.unreadMsgCount;
      }
    }
    return null;
  }

  getUnreadGroupMsgCount() {
    if (this.unreadGroupMsgCount) {
      if (this.unreadGroupMsgCount > 0) {
        return this.unreadGroupMsgCount;
      }
    }
    return null;
  }


  createUser() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).once('value')
      .then((account) => {
        // No database data yet, create user data on database
        if (!account.val()) {
          this.loadingProvider.show(CusConfig.loadingMsg);

          let user = firebase.auth().currentUser;
          let providerData = user.providerData[0];
          let userId = user.uid;
          // Get email from Firebase user.
          let email = user.email;
          // Set default description.
          let description = "I'm Available.";

          var name, provider, img;

          // Get name from Firebase user.
          if (user.displayName || providerData.displayName) {
            name = user.displayName;
            name = providerData.displayName;
          } else {
            name = "App User";
          }

          // Set default username based on name and userId.
          let username = name.replace(/ /g, '') + userId.substring(0, 8);

          // Get provider from Firebase user.
          if (providerData.providerId == 'password') {
            provider = "Firebase";
          } else if (providerData.providerId == 'facebook.com') {
            provider = "Facebook";
          }
          // else if (providerData.providerId == 'google.com') {
          //   provider = "Google";
          // }

          // Get photoURL from Firebase user.
          if (user.photoURL || providerData.photoURL) {
            img = user.photoURL;
            img = providerData.photoURL;
          } else {
            img = "assets/images/profile.png";
          }

          // Insert data on our database using AngularFire.
          this.angularfire.object('/accounts/' + userId).set({
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            dateCreated: new Date().toString()
          }).then(() => {
            this.loadingProvider.hide();
          });
        }
      });
  }
}
