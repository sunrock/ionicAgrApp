import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from "ionic-angular";

@Injectable()
export class LoadingProvider {

  // Loading Provider
  // This is the provider class for most of the loading spinners screens on the app.

  private loading;
  constructor(private loadingController: LoadingController) {
    console.log("Initializing Loading Provider");
  }

  //Show loading
  show(details: string) {
    let loadingOpts: LoadingOptions = {
        spinner: 'circles',
        content: details
    }

    if (!this.loading) {
      this.loading = this.loadingController.create(loadingOpts);
      this.loading.present();
    }
  }

  //Hide loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  

}
