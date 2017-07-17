import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Validation } from "../../support/validation";
import { AuthProvider } from "../../providers/auth";

@IonicPage()
@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html',
})
export class LoginPage {

  private mode: string;
  private emailPasswordForm: FormGroup;
  private emailForm: FormGroup;

  // LoginPage
  constructor(public navCtrl: NavController, 
              public authProvider: AuthProvider, 
              public formBuilder: FormBuilder) {
    // It's important to hook the navController to our loginProvider.
    this.authProvider.setNavController(this.navCtrl);
    // Create our forms and their validators based on validators set on validator.ts.
    this.emailPasswordForm = formBuilder.group({
      email: Validation.emailValidator,
      password: Validation.passwordValidator,
    });
    this.emailForm = formBuilder.group({
      email: Validation.emailValidator
    });
  }

  ionViewDidLoad() {
    // Set view mode to main.
    this.mode = 'main';
  }

  // Call loginProvider and login the user with email and password.
  // You may be wondering where the login function for Facebook and Google are.
  // They are called directly from the html markup via loginProvider.facebookLogin() and loginProvider.googleLogin().
  login() {
    this.authProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);
  }

  // Call loginProvider and register the user with email and password.
  register() {
    this.authProvider.register(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);
  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.authProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
  }

}
