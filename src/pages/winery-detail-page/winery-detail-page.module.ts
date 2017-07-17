import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WineryDetailPage } from './winery-detail-page';

@NgModule({
  declarations: [
    WineryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WineryDetailPage),
  ],
  exports: [
    WineryDetailPage
  ]
})
export class WineryDetailPageModule {}
