import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegionDetailPage } from './region-detail-page';

@NgModule({
  declarations: [
    RegionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RegionDetailPage),
  ],
  exports: [
    RegionDetailPage
  ]
})
export class RegionDetailPageModule {}
