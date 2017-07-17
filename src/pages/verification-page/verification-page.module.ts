import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificationPage } from './verification-page';

@NgModule({
  declarations: [
    VerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(VerificationPage),
  ],
  exports: [
    VerificationPage
  ]
})
export class VerificationPageModule {}
