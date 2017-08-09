import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { CusConfig } from "../../support/config";
import { Geolocation } from '@ionic-native/geolocation';

import { LoadingProvider } from "../../providers/loading";
import { LocationProvider } from "../../providers/location";
import { RegionDetailPage } from "../region-detail-page/region-detail-page";
import { WineryDetailPage } from "../winery-detail-page/winery-detail-page";


declare var google: any;

@IonicPage()
@Component({
  selector: 'page-discover-page',
  templateUrl: 'discover-page.html',
})
export class DiscoverPage {

  private map: any;
  private markers = [];
  private myMarker: any;

  cursorInfoWindow = new google.maps.InfoWindow();
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public locationProvider: LocationProvider,
              public loadingProvider: LoadingProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Discover Page');
    this.platform.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {

    this.loadingProvider.show(CusConfig.loadingMsg);

    this.geolocation.getCurrentPosition().then((position) => {
      
      let divMap = (<HTMLInputElement>document.getElementById('map'));

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log("Current:" + latLng);
      let mapOptions = {
        center: latLng,
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(divMap, mapOptions);

      this.createBlueDotMarker(latLng);
      
      this.locationProvider.getWineries().subscribe(
        (locations) => {
          locations.forEach(
            (location) => {
              let latLng = new google.maps.LatLng(location.lat, location.long);
              let wineryKey = location.$key;
              let regionKey = location.region;
              this.locationProvider.getRegionById(location.region).subscribe(
                (belongTo) => {
                  let content = "<p><a id='wineryLink'><font size='3px'><b>" + location.name + "</b></font></a></p>" + 
                                "<div id='regionLink'><u>" + belongTo.name + "</u> Wine Region</div>";
                  let params = {
                    content: content,
                    winery: wineryKey,
                    region: regionKey
                  }
                  this.createMapMarker(latLng, params);
                }
              );           
            });
          this.loadingProvider.hide();      
        }
      )
    }, (err) => {
      console.log(err);
    });
  }  
  
  createMapMarker(place, params): void {

    var marker = new google.maps.Marker({
      map: this.map,
      position: place
    });
    this.markers.push(marker);

    this.createInfoWindow(marker, params);

  }

  createBlueDotMarker(place): void { 
    
    var marker = new google.maps.Marker({
      map: this.map,
      position: place,
      icon: { 
        url: '../../assets/icon/dot.png',
        size: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 30),
        scaledSize: new google.maps.Size(30, 30)
      },
      animation: google.maps.Animation.DROP

    });

    this.myMarker = marker;
  }

  createInfoWindow(marker, params): void {

    // let newContent = '<p id = "clickId"><font color="blue">Click</font></p>' + params.content;
        
    google.maps.event.addListener(marker, 'click', () => {

      this.cursorInfoWindow.setContent(params.content);
      this.cursorInfoWindow.open(this.map, marker);
      
      // google.maps.event.addListenerOnce(this.cursorInfoWindow, 'domready', () => {
      //   document.getElementById('clickId').addEventListener('click', () => {
      //     // alert('Clicked');
      //   });
      // });

      google.maps.event.addListenerOnce(this.cursorInfoWindow, 'domready', () => {
        document.getElementById('wineryLink').addEventListener('click', () => {
          this.navCtrl.push(WineryDetailPage, { 
            wineryId: params.winery,
            regionId: params.region
           });
        });
      });

      google.maps.event.addListenerOnce(this.cursorInfoWindow, 'domready', () => {
        document.getElementById('regionLink').addEventListener('click', () => {
          this.navCtrl.push(RegionDetailPage, { regionId: params.region });
        });
      });
    });
  }

}
