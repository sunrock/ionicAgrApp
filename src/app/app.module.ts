import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// settings
import * as firebase from 'firebase';
import { CusConfig } from "../support/config";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// pages
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login-page/login-page";
import { VerificationPage } from "../pages/verification-page/verification-page";

import { RegionPage } from "../pages/region-page/region-page";
import { DiscoverPage } from "../pages/discover-page/discover-page";

import { RegionDetailPage } from "../pages/region-detail-page/region-detail-page";
import { WineryDetailPage } from "../pages/winery-detail-page/winery-detail-page";

// ionic-native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { WineryListPage } from "../pages/winery-list-page/winery-list-page";
import { RegionListPage } from "../pages/region-list-page/region-list-page";

// providers
import { AlertProvider } from "../providers/alert";
import { LoadingProvider } from "../providers/loading";
import { AuthProvider } from "../providers/auth";
import { LogoutProvider } from "../providers/logout";
import { DataProvider } from "../providers/data";
import { RequestProvider } from "../providers/request";
import { LocationProvider } from "../providers/location";

// pipes
import { ContactPipe } from "../pipes/contact";
import { ChatPipe } from "../pipes/chat";
import { DateFormatPipe } from "../pipes/date";
import { GroupPipe } from "../pipes/group";
import { SearchPipe } from "../pipes/search";
import { RegionPipe } from "../pipes/region";
import { ContactInfoPage } from "../pages/contact-info-page/contact-info-page";
import { ContactSearchPage } from "../pages/contact-search-page/contact-search-page";
import { ContactListPage } from "../pages/contact-list-page/contact-list-page";
import { ChatListPage } from "../pages/chat-list-page/chat-list-page";
import { ChatMsgPage } from "../pages/chat-msg-page/chat-msg-page";
import { RequestsPage } from "../pages/requests-page/requests-page";




firebase.initializeApp(CusConfig.firebaseConfig);

@NgModule({
  declarations: [
    MyApp,

    // pipes
    ContactPipe,
    ChatPipe,
    DateFormatPipe,
    GroupPipe,
    SearchPipe,
    RegionPipe,

    // pages
    TabsPage,
    LoginPage,
    VerificationPage,
    RegionPage,

    DiscoverPage,
    RegionDetailPage,
    WineryDetailPage,
    RegionListPage,
    WineryListPage,

    ContactListPage,
    ContactSearchPage,
    ContactInfoPage,
    ChatListPage,
    ChatMsgPage,
    RequestsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(CusConfig.firebaseConfig,'agrAppIonic3'),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    VerificationPage,
    RegionPage,

    DiscoverPage,
    RegionDetailPage,
    WineryDetailPage,
    RegionListPage,
    WineryListPage,

    ContactListPage,
    ContactSearchPage,
    ContactInfoPage,
    ChatListPage,
    ChatMsgPage,
    RequestsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    LoadingProvider,
    AlertProvider,
    LogoutProvider,
    DataProvider,
    RequestProvider,
    LocationProvider,
  ]
})
export class AppModule {}
