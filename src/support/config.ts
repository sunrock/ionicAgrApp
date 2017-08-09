
import { TabsPage } from "../pages/tabs/tabs";
import { VerificationPage } from "../pages/verification-page/verification-page";

export namespace CusConfig {
  // replace with your key
  export const firebaseConfig = {
    // Previous
    // apiKey: "AIzaSyBBaUSXvpI1gTCkTJv_Hm-_6LLqjxK5HAU",
    // authDomain: "agrapp-26fb0.firebaseapp.com",
    // databaseURL: "https://agrapp-26fb0.firebaseio.com",
    // projectId: "agrapp-26fb0",
    // storageBucket: "agrapp-26fb0.appspot.com",
    // messagingSenderId: "778209009902"

    // Winery Region
    apiKey: "AIzaSyD9h6H2goywpVIXak_XH3sxf6uXvp8kxbk",
    authDomain: "wineryregionapp-eb216.firebaseapp.com",
    databaseURL: "https://wineryregionapp-eb216.firebaseio.com",
    projectId: "wineryregionapp-eb216",
    storageBucket: "wineryregionapp-eb216.appspot.com",
    messagingSenderId: "1003253563674"
  };
  export const facebookAppId: string = "767580770058358";
  export const googleClientId: string = "478860799652-526uf84nsn4jfjg0l2trbivm1676ohgb.apps.googleusercontent.com";
  export const homePage = TabsPage;
  export const verificationPage = VerificationPage;
  export const emailVerification: boolean = true;
  export const loadingMsg = 'Loading...';
  export const signinMsg = 'Signing in...';
  export const blankMsg = '';
}