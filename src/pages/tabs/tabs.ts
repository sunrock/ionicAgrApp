import { Component } from '@angular/core';
import { RegionPage } from "../region-page/region-page";
import { DiscoverPage } from "../discover-page/discover-page";
import { RegionListPage } from "../region-list-page/region-list-page";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RegionPage;
  tab2Root = DiscoverPage;
  tab3Root = RegionPage;
  tab4Root = RegionListPage;
  

  constructor() {

  }
}
