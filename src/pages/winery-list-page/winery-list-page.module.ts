import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WineryListPage } from './winery-list-page';

@NgModule({
  declarations: [
    WineryListPage,
  ],
  imports: [
    IonicPageModule.forChild(WineryListPage),
  ],
  exports: [
    WineryListPage
  ]
})
export class WineryListPageModule {}
