import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CusConfig } from "../../support/config";
import * as firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { LoadingProvider } from "../../providers/loading";
import { DataProvider } from "../../providers/data";
import { LogoutProvider } from "../../providers/logout";
import { AlertProvider } from "../../providers/alert";
import { Validation } from "../../support/validation";

@IonicPage()
@Component({
  selector: 'page-profile-page',
  templateUrl: 'profile-page.html',
})
export class ProfilePage {

  private user: any;
  private alert;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingProvider: LoadingProvider,
              public logoutProvider: LogoutProvider,
              public dataProvider: DataProvider,
              public alertProvider: AlertProvider,
              public angularfire: AngularFireDatabase) {
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

  // Change user's profile name, username, and description.
  setName() {
    this.alert = this.alertCtrl.create({
      title: 'Change Profile Name',
      message: "Please enter a new profile name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Your Name',
          value: this.user.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            // Check if entered name is different from the current name
            if (this.user.name != name) {
              // Check if name's length is more than five characters
              if (name.length >= Validation.profileNameValidator.minLength) {
                // Check if name contains characters and numbers only.
                if (Validation.profileNameValidator.pattern.test(name)) {
                  this.loadingProvider.show(CusConfig.blankMsg);
                  let profile = {
                    displayName: name,
                    photoURL: this.user.photoURL
                  };
                  // Update profile on Firebase
                  firebase.auth().currentUser.updateProfile(profile)
                    .then((success) => {
                      this.loadingProvider.hide();
                      // Update userData on Database.
                      this.angularfire.object('/accounts/' + this.user.userId).update({
                        name: name
                      }).then((success) => {
                        Validation.profileNameValidator.pattern.test(name); //Refresh validator
                        this.alertProvider.showProfileUpdatedMessage();
                      }).catch((error) => {
                        this.alertProvider.showErrorMessage('profile/error-update-profile');
                      });
                    })
                    .catch((error) => {
                      // Show error
                      this.loadingProvider.hide();
                      let code = error["code"];
                      this.alertProvider.showErrorMessage(code);
                      if (code == 'auth/requires-recent-login') {
                        this.logoutProvider.logout();
                      }
                    });
                } else {
                  this.alertProvider.showErrorMessage('profile/invalid-chars-name');
                }
              } else {
                this.alertProvider.showErrorMessage('profile/name-too-short');
              }
            }
          }
        }
      ]
    }).present();
  }

  //Set username
  setUsername() {
    this.alert = this.alertCtrl.create({
      title: 'Change Username',
      message: "Please enter a new username.",
      inputs: [
        {
          name: 'username',
          placeholder: 'Your Username',
          value: this.user.username
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let username = data["username"];
            // Check if entered username is different from the current username
            if (this.user.username != username) {
              this.dataProvider.getUserByUsername(username).take(1).subscribe((userList) => {
                if (userList.length > 0) {
                  this.alertProvider.showErrorMessage('profile/error-same-username');
                } else {
                  this.angularfire.object('/accounts/' + this.user.userId).update({
                    username: username
                  }).then((success) => {
                    this.alertProvider.showProfileUpdatedMessage();
                  }).catch((error) => {
                    this.alertProvider.showErrorMessage('profile/error-update-profile');
                  });
                }
              });
            }
          }
        }
      ]
    }).present();
  }

  //Set description
  setDescription() {
    this.alert = this.alertCtrl.create({
      title: 'Change Description',
      message: "Please enter a new description.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Your Description',
          value: this.user.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let description = data["description"];
            // Check if entered description is different from the current description
            if (this.user.description != description) {
              this.angularfire.object('/accounts/' + this.user.userId).update({
                description: description
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    }).present();
  }

  // Change user's email. Uses Validator.ts to validate the entered email. After, update the userData on database.
  // When the user changed their email, they have to confirm the new email address.
  setEmail() {
    this.alert = this.alertCtrl.create({
      title: 'Change Email Address',
      message: "Please enter a new email address.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your Email Address',
          value: this.user.email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let email = data["email"];
            //Check if entered email is different from the current email
            if (this.user.email != email) {
              //Check if email is valid.
              if (Validation.profileEmailValidator.pattern.test(email)) {
                this.loadingProvider.show(CusConfig.blankMsg);
                // Update email on Firebase.
                firebase.auth().currentUser.updateEmail(email)
                  .then((success) => {
                    // Update userData on Database.
                    this.angularfire.object('/accounts/' + this.user.userId).update({
                      email: email
                    }).then((success) => {
                      Validation.profileEmailValidator.pattern.test(email);
                      // Check if emailVerification is enabled, if it is go to verificationPage.
                      if (CusConfig.emailVerification) {
                        if (!firebase.auth().currentUser.emailVerified) {
                          this.navCtrl.setRoot(CusConfig.verificationPage);
                        }
                      }
                    }).catch((error) => {
                      this.alertProvider.showErrorMessage('profile/error-change-email');
                    });
                  })
                  .catch((error) => {
                    //Show error
                    this.loadingProvider.hide();
                    let code = error["code"];
                    this.alertProvider.showErrorMessage(code);
                    if (code == 'auth/requires-recent-login') {
                      this.logoutProvider.logout();
                    }
                  });
              } else {
                this.alertProvider.showErrorMessage('profile/invalid-email');
              }
            }
          }
        }
      ]
    }).present();
  }

  // Change user's password, this option only shows up for users registered via Firebase.
  // The currentPassword is first checked, after which the new password should be entered twice.
  // Uses password validator from Validator.ts.
  setPassword() {
    this.alert = this.alertCtrl.create({
      title: 'Change Password',
      message: "Please enter a new password.",
      inputs: [
        {
          name: 'currentPassword',
          placeholder: 'Current Password',
          type: 'password'
        },
        {
          name: 'password',
          placeholder: 'New Password',
          type: 'password'
        },
        {
          name: 'confirmPassword',
          placeholder: 'Confirm Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let currentPassword = data["currentPassword"];
            let credential = firebase.auth.EmailAuthProvider.credential(this.user.email, currentPassword);
            // Check if currentPassword entered is correct
            this.loadingProvider.show(CusConfig.blankMsg);
            firebase.auth().currentUser.reauthenticateWithCredential(credential)
              .then((success) => {
                let password = data["password"];
                // Check if entered password is not the same as the currentPassword
                if (password != currentPassword) {
                  if (password.length >= Validation.profilePasswordValidator.minLength) {
                    if (Validation.profilePasswordValidator.pattern.test(password)) {
                      if (password == data["confirmPassword"]) {
                        // Update password on Firebase.
                        firebase.auth().currentUser.updatePassword(password)
                          .then((success) => {
                            this.loadingProvider.hide();
                            Validation.profilePasswordValidator.pattern.test(password);
                            this.alertProvider.showPasswordChangedMessage();
                          })
                          .catch((error) => {
                            this.loadingProvider.hide();
                            let code = error["code"];
                            this.alertProvider.showErrorMessage(code);
                            if (code == 'auth/requires-recent-login') {
                              this.logoutProvider.logout();
                            }
                          });
                      } else {
                        this.alertProvider.showErrorMessage('profile/passwords-do-not-match');
                      }
                    } else {
                      this.alertProvider.showErrorMessage('profile/invalid-chars-password');
                    }
                  } else {
                    this.alertProvider.showErrorMessage('profile/password-too-short');
                  }
                }
              })
              .catch((error) => {
                //Show error
                this.loadingProvider.hide();
                let code = error["code"];
                this.alertProvider.showErrorMessage(code);
              });
          }
        }
      ]
    }).present();
  }
}
