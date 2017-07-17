import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegionPage } from './region-page';

@NgModule({
  declarations: [
    RegionPage,
  ],
  imports: [
    IonicPageModule.forChild(RegionPage),
  ],
  exports: [
    RegionPage
  ]
})
export class RegionPageModule {}
