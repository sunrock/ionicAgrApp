import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, 
         ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase';

import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";

import { Geolocation } from "@ionic-native/geolocation";

import { CusConfig } from "../../support/config";

import { ContactInfoPage } from "../contact-info-page/contact-info-page";
import { Keyboard } from "@ionic-native/keyboard";

@IonicPage()
@Component({
  selector: 'page-chat-msg-page',
  templateUrl: 'chat-msg-page.html',
})
export class ChatMsgPage {

  @ViewChild(Content) content: Content;
  private userId: any;
  private contactName: any;
  private message: any;
  private chatId: any;
  private messages: any;
  // private alert: any;
  private updateDateTime: any;
  private messagesToShow: any;
  private startIndex: any = -1;
  private scrollDirection: any = 'bottom';
  // Set number of messages to show.
  private numberOfMessages = 10;

  // ChatMsgPage (Chat Messages)
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public dataProvider: DataProvider, public angularfire: AngularFireDatabase,
              public loadingProvider: LoadingProvider, 
              // public alertCtrl: AlertController,
              // public imageProvider: ImageProvider, 
              // public camera: Camera,
              // public contacts: Contacts, 
              public modalCtrl: ModalController, 
              public keyboard: Keyboard, 
              public actionSheet: ActionSheetController, public geolocation: Geolocation) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatMsgPage');

    this.userId = this.navParams.get('userId');

    // Get contact details.
    this.dataProvider.getUserById(this.userId).subscribe((user) => {
      this.contactName = user.name;
    });

    // Get chatInfo
    this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/chats/' + this.userId).subscribe((chatInfo) => {
      console.log('chatInfo: ' + chatInfo);
      if (chatInfo.$exists()) {
        // already have a chat
        this.chatId = chatInfo.chatId;

        // Get chat
        this.dataProvider.getChatMessages(this.chatId).subscribe((messages) => {
          if (this.messages) {
            // Just append newly added messages to the bottom of the view.
            if (messages.length > this.messages.length) {
              let message = messages[messages.length - 1];
              this.dataProvider.getUserById(message.sender).subscribe((user) => {
                message.avatar = user.img;
              });
              this.messages.push(message);
              // Also append to messagesToShow.
              this.messagesToShow.push(message);
              // Reset scrollDirection to bottom.
              this.scrollDirection = 'bottom';
            }
          } else {
            // Get all messages, this will be used as reference object for messagesToShow.
            this.messages = [];

            // handle TypeError: messages.forEach is not a function
            Array.prototype.forEach.call(messages, message => {
              this.dataProvider.getUserById(message.sender).subscribe((user) => {
                message.avatar = user.img;
              });
              this.messages.push(message);
            });

            // Load messages in relation to numOfMessages.
            if (this.startIndex == -1) {
              // Get initial index for numberOfMessages to show.
              if ((this.messages.length - this.numberOfMessages) > 0) {
                this.startIndex = this.messages.length - this.numberOfMessages;
              } else {
                this.startIndex = 0;
              }
            }
            if (!this.messagesToShow) {
              this.messagesToShow = [];
            }
            // Set messagesToShow
            for (var i = this.startIndex; i < this.messages.length; i++) {
              this.messagesToShow.push(this.messages[i]);
            }
            this.loadingProvider.hide();
          }
        });
      }
    });

    // Update messages' date time elapsed every minute based on Moment.js.
    var that = this;
    if (!that.updateDateTime) {
      that.updateDateTime = setInterval(function() {
        if (that.messages) {
          that.messages.forEach((message) => {
            let date = message.date;
            message.date = new Date(date);
          });
        }
      }, 60000);
    }
  }

  // Load previous messages in relation to numberOfMessages.
  loadPreviousMessages() {
    var that = this;
    // Show loading.
    this.loadingProvider.show(CusConfig.loadingMsg);

    setTimeout(function() {
      // Set startIndex to load more messages.
      if ((that.startIndex - that.numberOfMessages) > -1) {
        that.startIndex -= that.numberOfMessages;
      } else {
        that.startIndex = 0;
      }
      // Refresh our messages list.
      that.messages = null;
      that.messagesToShow = null;
      // Set scroll direction to top.
      that.scrollDirection = 'top';
      // Populate list again.
      that.ionViewDidLoad();
    }, 1000);
  }

  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    if (this.messages)
      this.setMessagesRead(this.messages);
  }

  // Check if currentPage is active, then update user's messagesRead.
  setMessagesRead(messages) {
    if (this.navCtrl.getActive().instance instanceof ChatMsgPage) {
      // Update user's messagesRead on database.
      var totalMessagesCount;
      this.dataProvider.getChatMessages(this.chatId).subscribe((messages) => {
        totalMessagesCount = messages.length;
      });
      this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/chats/' + this.userId).update({
        messagesRead: totalMessagesCount
      });
    }
  }

  // Check if 'return' button is pressed and send the message.
  onType(keyCode) {
    if (keyCode == 13) {
      this.keyboard.close();
      this.send();
    }
  }

  // Scroll to bottom of page after a short delay.
  scrollBottom() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 300);
  }

  // Scroll to top of the page after a short delay.
  scrollTop() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 300);
  }

  // Scroll depending on the direction.
  doScroll() {
    if (this.scrollDirection == 'bottom') {
      this.scrollBottom();
    } else if (this.scrollDirection == 'top') {
      this.scrollTop();
    }
  }

  // Check if the user is the sender of the message.
  isSender(message) {
    if (message.sender == firebase.auth().currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  // Send message, if no chats, create a new chat.
  send() {
    if (this.message) {
      // User entered a text on messagebox
      if (this.chatId) {
        // Add Message to the existing chat
        // Clone an instance of messages object so it will not directly be updated.
        let messages = JSON.parse(JSON.stringify(this.messages));
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        // Update chat on database.
        this.dataProvider.getChatById(this.chatId).update({
          messages: messages
        });
        // Clear messagebox.
        this.message = '';
      } else {
        // Creat a new chat
        var messages = [];
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        var users = [];
        users.push(firebase.auth().currentUser.uid);
        users.push(this.userId);
        // Add chat to chat list.
        this.angularfire.list('chats').push({
          dateCreated: new Date().toString(),
          messages: messages,
          users: users
        }).then((success) => {
          let newChatId = success.key;
          this.message = '';
          // Add the chat reference to the users.
          this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/chats/' + this.userId).update({
            chatId: newChatId,
            messagesRead: 1
          });
          this.angularfire.object('/accounts/' + this.userId + '/chats/' + firebase.auth().currentUser.uid).update({
            chatId: newChatId,
            messagesRead: 0
          });
        });
      }
    }
  }

  // View user info
  viewUser(userId) {
    this.navCtrl.push(ContactInfoPage, { userId: userId });
  }


  // attach(){
  //   let action = this.actionSheet.create({
  //     title:'Choose attachments',
  //     buttons:[{
  //       text: 'Camera',
  //       handler: () =>{
  //         console.log("take photo");
  //         this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.CAMERA).then((url) => {
  //           // Process image message.
  //           this.sendPhotoMessage(url);
  //         });
  //       }
  //     },{
  //       text: 'Photo Library',
  //       handler: ()=>{
  //         console.log("Access gallery");
  //         this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
  //             // Process image message.
  //             this.sendPhotoMessage(url);
  //         });
  //       }
  //     },{
  //       text: 'Video',
  //       handler: () =>{
  //         console.log("Video");
  //         this.imageProvider.uploadVideoMessage(this.conversationId).then(url=>{
  //           this.sendVideoMessage(url);
  //         });
  //       }
  //     },{
  //       text: 'Location',
  //       handler:()=>{
  //         console.log("Location");
  //         this.geolocation.getCurrentPosition({
  //           timeout: 2000
  //         }).then(res => {
  //           let locationMessage = "current location: lat:"+res.coords.latitude+" lng:"+res.coords.longitude;
  //           let confirm = this.alertCtrl.create({
  //             title: 'Your Location',
  //             message: locationMessage,
  //             buttons:[{
  //               text:'cancel',
  //               handler: () =>{
  //                 console.log("canceled");
  //               }
  //             },{
  //               text: 'Share',
  //               handler: () =>{
  //                 console.log("share");
  //                 this.message = locationMessage;
  //                 this.send();
  //               }
  //             }]
  //           });
  //           confirm.present();
  //         }, locationErr => {
  //           console.log("Location Error"+ JSON.stringify(locationErr));
  //         });
  //       }
  //     },{
  //       text: 'Contact',
  //       handler: () =>{
  //         console.log("Share contact");
  //         this.contacts.pickContact().then( data =>{
  //           console.log(data.displayName);
  //           console.log(data.phoneNumbers[0].value);
  //           this.message = data.displayName+" ph: "+data.phoneNumbers[0].value;
  //           this.send();
  //         }, err=>{
  //           console.log(err);
  //         })
  //       }
  //     },{
  //       text: 'cancel',
  //       role: 'cancel',
  //       handler: ()=>{
  //         console.log("cancelled");
  //       }
  //     }]
  //   });
  //   action.present();
  // }
  // takePhoto(){
  //   this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.CAMERA).then((url) => {
  //     // Process image message.
  //     this.sendPhotoMessage(url);
  //   });
  // }

  // // Process photoMessage on database.
  // sendPhotoMessage(url) {
  //   if (this.conversationId) {
  //     // Add image message to existing conversation.
  //     let messages = JSON.parse(JSON.stringify(this.messages));
  //     messages.push({
  //       date: new Date().toString(),
  //       sender: firebase.auth().currentUser.uid,
  //       type: 'image',
  //       url: url
  //     });
  //     // Update conversation on database.
  //     this.dataProvider.getChatById(this.conversationId).update({
  //       messages: messages
  //     });
  //   } else {
  //     // Create new conversation.
  //     var messages = [];
  //     messages.push({
  //       date: new Date().toString(),
  //       sender: firebase.auth().currentUser.uid,
  //       type: 'image',
  //       url: url
  //     });
  //     var users = [];
  //     users.push(firebase.auth().currentUser.uid);
  //     users.push(this.userId);
  //     // Add conversation.
  //     this.angularfire.list('conversations').push({
  //       dateCreated: new Date().toString(),
  //       messages: messages,
  //       users: users
  //     }).then((success) => {
  //       let conversationId = success.key;
  //       // Add conversation references to users.
  //       this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
  //         conversationId: conversationId,
  //         messagesRead: 1
  //       });
  //       this.angularfire.object('/accounts/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
  //         conversationId: conversationId,
  //         messagesRead: 0
  //       });
  //     });
  //   }
  // }
  //   // Process Video on database.
  // sendVideoMessage(url) {
  //   if (this.conversationId) {
  //     // Add image message to existing conversation.
  //     let messages = JSON.parse(JSON.stringify(this.messages));
  //     messages.push({
  //       date: new Date().toString(),
  //       sender: firebase.auth().currentUser.uid,
  //       type: 'video',
  //       url: url
  //     });
  //     // Update conversation on database.
  //     this.dataProvider.getChatById(this.conversationId).update({
  //       messages: messages
  //     });
  //   } else {
  //     // Create new conversation.
  //     var messages = [];
  //     messages.push({
  //       date: new Date().toString(),
  //       sender: firebase.auth().currentUser.uid,
  //       type: 'video',
  //       url: url
  //     });
  //     var users = [];
  //     users.push(firebase.auth().currentUser.uid);
  //     users.push(this.userId);
  //     // Add conversation.
  //     this.angularfire.list('conversations').push({
  //       dateCreated: new Date().toString(),
  //       messages: messages,
  //       users: users
  //     }).then((success) => {
  //       let conversationId = success.key;
  //       // Add conversation references to users.
  //       this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
  //         conversationId: conversationId,
  //         messagesRead: 1
  //       });
  //       this.angularfire.object('/accounts/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
  //         conversationId: conversationId,
  //         messagesRead: 0
  //       });
  //     });
  //   }
  // }

  // // Enlarge image messages.
  // enlargeImage(img) {
  //   let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
  //   imageModal.present();
  // }

}
