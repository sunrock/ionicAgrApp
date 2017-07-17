import { Component } from '@angular/core';
import { RegionPage } from "../region-page/region-page";
import { DiscoverPage } from "../discover-page/discover-page";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RegionPage;
  tab2Root = DiscoverPage;
  tab3Root = RegionPage;
  tab4Root = RegionPage;
  

  constructor() {

  }
}
