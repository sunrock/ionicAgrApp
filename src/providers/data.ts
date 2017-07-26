import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class DataProvider {

  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.

  constructor(public angularfire: AngularFireDatabase) {
    console.log("Data Provider");
  }

  // Get all users
  getUsers() {
    return this.angularfire.list('/accounts', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  // Get users by username
  getUserByUsername(username) {
    return this.angularfire.list('/accounts', {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    });
  }

  // Get the current user
  getCurrentUser() {
    return this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid);
  }

  // Get a user by userId
  getUserById(userId) {
    return this.angularfire.object('/accounts/' + userId);
  }

  // Get requests of a user.
  getRequests(userId) {
    return this.angularfire.object('/requests/' + userId);
  }

  // Get friend requests (received) of a user.
  getRcvRequests(userId) {
    return this.angularfire.list('/requests', {
      query: {
        orderByChild: 'receiver',
        equalTo: userId
      }
    });
  }

  // Get a chat by chatId.
  getChatById(chatId) {
    return this.angularfire.object('/chats/' + chatId);
  }

  // Get chats of the current user.
  getChats() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/chats');
  }

  // Get messages of a chat by chatId.
  getChatMessages(chatId) {
    return this.angularfire.object('/chats/' + chatId + '/messages');
  }

  // Get messages of a group chat by groupId.
  getGroupMessages(groupId) {
    return this.angularfire.object('/groups/' + groupId + '/messages');
  }

  // Get groups of the current user.
  getGroups() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/groups');
  }

  // Get group info by groupId.
  getGroup(groupId) {
    return this.angularfire.object('/groups/' + groupId);
  }

}
