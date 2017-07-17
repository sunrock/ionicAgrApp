import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegionListPage } from './region-list-page';

@NgModule({
  declarations: [
    RegionListPage,
  ],
  imports: [
    IonicPageModule.forChild(RegionListPage),
  ],
  exports: [
    RegionListPage
  ]
})
export class RegionListPageModule {}
