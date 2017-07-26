import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactSearchPage } from './contact-search-page';

@NgModule({
  declarations: [
    ContactSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactSearchPage),
  ],
  exports: [
    ContactSearchPage
  ]
})
export class ContactSearchPageModule {}
