import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

import { LoadingProvider } from "./loading";
import { AlertProvider } from "./alert";
import { DataProvider } from "./data";

import 'rxjs/add/operator/take';
import * as firebase from 'firebase';
import { CusConfig } from "../support/config";

@Injectable()
export class RequestProvider {

  // Request Provider
  // This is the provider class for managing requests.

  constructor(public angularfire: AngularFireDatabase, public loadingProvider: LoadingProvider, 
              public alertProvider: AlertProvider, public dataProvider: DataProvider) {
    console.log("Initializing Request Provider");
  }

  // Send friend request to userId.
  sendFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    
    this.loadingProvider.show(CusConfig.blankMsg);

    var reqSent;
    // Use take(1) so that subscription will only trigger once.
    this.dataProvider.getRequests(loggedInUserId).take(1).subscribe((requests) => {
      reqSent = requests.reqSent;
      if (!reqSent) {
        reqSent = [userId];
      } else {
        if(reqSent.indexOf(userId) == -1)
          reqSent.push(userId);
      }
      // Update reqSent (requestsSent information).
      this.angularfire.object('/requests/' + loggedInUserId).update({
        reqSent: reqSent
      }).then((success) => {
        // friendRequest is the received requests (sent from other ppl)
        var reqRcv;
        this.dataProvider.getRequests(userId).take(1).subscribe((requests) => {
          reqRcv = requests.reqRcv;
          if (!reqRcv) {
            reqRcv = [loggedInUserId];
          } else {
            if(reqRcv.indexOf(userId) == -1)
              reqRcv.push(loggedInUserId);
          }
          // Update reqRsv (friendRequest information).
          this.angularfire.object('/requests/' + userId).update({
            reqRcv: reqRcv
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestSent();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Cancel friend request sent to userId.
  cancelFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;

    this.loadingProvider.show(CusConfig.blankMsg);

    var reqSent;
    this.dataProvider.getRequests(loggedInUserId).take(1).subscribe((requests) => {
      reqSent = requests.reqSent;
      reqSent.splice(reqSent.indexOf(userId), 1);
      // Update requestSent information.
      this.angularfire.object('/requests/' + loggedInUserId).update({
        reqSent: reqSent
      }).then((success) => {
        var reqRcv;
        this.dataProvider.getRequests(userId).take(1).subscribe((requests) => {
          reqRcv = requests.reqRcv;
          reqRcv.splice(reqRcv.indexOf(loggedInUserId), 1);
          // Update requestsReceived information.
          this.angularfire.object('/requests/' + userId).update({
            reqRcv: reqRcv
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestRemoved();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Delete friend request.
  deleteFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;

    this.loadingProvider.show(CusConfig.blankMsg);

    var reqRcv;
    this.dataProvider.getRequests(loggedInUserId).take(1).subscribe((requests) => {
      reqRcv = requests.reqRcv;
      reqRcv.splice(reqRcv.indexOf(userId), 1);
      // Update reqRcv information.
      this.angularfire.object('/requests/' + loggedInUserId).update({
        reqRcv: reqRcv
      }).then((success) => {
        var reqSent;
        this.dataProvider.getRequests(userId).take(1).subscribe((requests) => {
          reqSent = requests.reqSent;
          reqSent.splice(reqSent.indexOf(loggedInUserId), 1);
          // Update requestsSent information.
          this.angularfire.object('/requests/' + userId).update({
            reqSent: reqSent
          }).then((success) => {
            this.loadingProvider.hide();

          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
        //TODO ERROR
      });
    });
  }

  // Accept friend request.
  acceptFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    // Delete friend request.
    this.deleteFriendRequest(userId);

    this.loadingProvider.show(CusConfig.blankMsg);

    this.dataProvider.getUserById(loggedInUserId).take(1).subscribe((account) => {
      var contacts = account.contacts;
      if (!contacts) {
        contacts = [userId];
      } else {
        contacts.push(userId);
      }
      // Add both users as friends.
      this.dataProvider.getUserById(loggedInUserId).update({
        contacts: contacts
      }).then((success) => {
        this.dataProvider.getUserById(userId).take(1).subscribe((account) => {
          var contacts = account.contacts;
          if (!contacts) {
            contacts = [loggedInUserId];
          } else {
            contacts.push(loggedInUserId);
          }
          this.dataProvider.getUserById(userId).update({
            contacts: contacts
          }).then((success) => {
            this.loadingProvider.hide();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }
}
