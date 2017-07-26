import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactInfoPage } from './contact-info-page';

@NgModule({
  declarations: [
    ContactInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactInfoPage),
  ],
  exports: [
    ContactInfoPage
  ]
})
export class ContactInfoPageModule {}
