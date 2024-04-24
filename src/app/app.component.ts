import { Component, OnInit, Inject, QueryList, ViewChildren, Pipe } from '@angular/core';
import { Platform, NavController, AlertController, IonRouterOutlet, ToastController, 
  LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { MyEvent } from 'services/myevent.services';
import { Constants } from 'models/contants.models';
import { Storage } from '@ionic/Storage';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Plugins,PushNotification,PushNotificationToken,
  PushNotificationActionPerformed,AppState} from '@capacitor/core';
const { App } = Plugins;
const { PushNotifications } = Plugins;

const { Device } = Plugins;

const { Browser } = Plugins;


import { HomePage } from './home/home.page';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ServiceService } from './services/service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
@Pipe({
  name: 'myuserstorage',
  pure: true

})


export class AppComponent implements OnInit {

  transform(value: number, args?: any): any {
        return this.myuserstorage();
  }
    
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList < IonRouterOutlet >;

   lastTimeBackPress = 0;
   timePeriodToExit = 2000;

  rtlSide = "left";
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'home',
      url: '/home',
      image: 'assets/imgs/ic_home.png'
    },
    {
      title: 'News',
      url: '/news',
      image: 'assets/imgs/ic_news.png'
    },
    {
      title: 'Podcasts',
      url: '/podcast',
      image: 'assets/imgs/ic_podcast.png'
    },
    {
      title: 'Messages(On Demand)',
      url: '/movies',
      image: 'assets/imgs/ic_gallery.png'
    },
    {
      title: 'Prayer Requests',
      url: '/prayers',
      image: 'assets/imgs/ic_prayer.png'
    }, 
     {
      title: 'events',
      url: '/events',
      image: 'assets/imgs/ic_events.png'
    }, 

 
  ]; 

  userid: any;
  datastorage: any;
  name: any;
  myuserid: any;
  mytokenid: any;

  version: any;
  data: any;

  info:any;
  currentversion: any;

  androidversion: any;
  iphoneversion: any;

  remoteToken: string;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private platform: Platform, private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private location: Location,
    private alertController: AlertController,
    private storage: Storage,
    private home: HomePage,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private translate: TranslateService, private myEvent: MyEvent,
    private accessprvd: ServiceService,
    private iab: InAppBrowser) {

    this.initializeApp();
    this.backButtonEvent();
    this.backButtonEvent2();
    this.myEvent.getLanguageObservable().subscribe(value => {
      this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });

    this.mypush();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);    
    });

    this.storage.get('session_1').then((res)=>{
      if(res == null){
        this.navCtrl.navigateForward(['/intro']);
      }else{
        console.log(res);
        this.navCtrl.navigateForward(['/home']);
      }
    });



  }



  globalize(languagePriority) {
    this.translate.setDefaultLang("en");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.rtlSide = "rtl";
        break;
      }
      default: {
        this.rtlSide = "ltr";
        break;
      }
    }
  }


  async ngOnInit() {
    this.getVersionData();
  }

  async mypush() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
   
    console.log('Initializing HomePage');

    const loader = await this.loadingCtrl.create({
      message: "Please wait......",
    });
    //loader.present();

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });


    /*FCM.getToken()
      .then((result) => {
        //this.remoteToken = result.token;
        alert('Push registration success, token: ' + result.token);
        return new Promise(resolve => {
          let body = {
            deviceregister: 'process_deviceregister',
            tokenid: result.token,

          }
          
          this.accessprvd.postData(body, 'devicereg-api.php').subscribe((res:any) =>{
             if(res.success1 == true) {
                //loader.dismiss();
                this.storage.get('session_1').then((res)=>{
                  if(res == null){
                    this.navCtrl.navigateForward(['/intro']);
                  }else{
                    console.log(res);
                    this.navCtrl.navigateForward(['/home']);
                  }
                });
             } else if(res.success == true) {
                  //loader.dismiss();
                  this.storage.get('session_1').then((res)=>{
                    if(res == null){
                      this.navCtrl.navigateForward(['/intro']);
                    }else{
                      console.log(res);
                      this.navCtrl.navigateForward(['/home']);
                    }
                  });
             }
          },(err)=>{
              //console.log(err);
              //alert(JSON.stringify(err));
          });

       });
      })
      .catch((err) => console.log(err));*/

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        //alert('Push registration success, token: ' + token.value);
        //return new Promise(resolve => {
          //this.mytokenid = token.value;

          return new Promise(resolve => {
            let body = {
              //deviceregister: 'process_deviceregister',
              tokenid: token.value,
  
            }
            
            this.accessprvd.postData(body, 'devicetoken').subscribe((res:any) =>{
               if(res.status1 == true) {
                  //loader.dismiss();
                  this.storage.get('session_1').then((res)=>{
                    if(res == null){
                      this.navCtrl.navigateForward(['/intro']);
                    }else{
                      console.log(res);
                      this.navCtrl.navigateForward(['/home']);
                    }
                  });
               } else if(res.status2 == true) {
                    //loader.dismiss();
                    this.storage.get('session_1').then((res)=>{
                      if(res == null){
                        this.navCtrl.navigateForward(['/intro']);
                      }else{
                        console.log(res);
                        this.navCtrl.navigateForward(['/home']);
                      }
                    });
               }
            },(err)=>{
                //console.log(err);
                //alert(JSON.stringify(err));
            });
  
         });
  

       //});


      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        //alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        //alert('Push received: ' + JSON.stringify(notification));
        this.presentAlert("Live service has started");
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        this.storage.get('session_1').then((res)=>{
          if(res == null){
            this.navCtrl.navigateForward(['/sign-in']);
          }else{
            this.navCtrl.navigateForward(['/livetv/1']); 
          }
        });

      }
    );


    //this.devicereg();
  

  }




  ionViewDidEnter() {
    
  }

  async myuserstorage() {
    this.home.myuserstorage()
  }


  async logout() {
    this.home.logout();
 }
  

  buyAppAction() {
    window.open("https://bit.ly/cc2_TheChurch", '_system', 'location=no');
  }

 programs() {
    this.navCtrl.navigateForward(['/programs/']);
 }

 profile() {
    this.navCtrl.navigateForward(['/my-profile/']);
 }

 feedback() {
  this.router.navigate(['./feedback']);
 }

 give() {
  //this.router.navigate(['./give']);
  //Browser.open({ url: 'https://aam.kccconline.org/give'});
  this.platform.ready().then(() => {
    let browser = this.iab.create("https:/adeajalaministries.org/kcccbackend/mobiledonation");
  });
}

 
  
  
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async(outlet: IonRouterOutlet) => {
        if (this.router.url != '/sign-in' && this.router.url != '/home') {
          // await this.router.navigate(['/']);
          await this.location.back();
        } else if (this.router.url === '/sign-in' || this.router.url === '/home') {
          if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
            this.lastTimeBackPress = new Date().getTime();
            //this.presentAlertConfirm();
            navigator['app'].exitApp();
          } 
        }
      });
    });
  }

  backButtonEvent2() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      this.routerOutlets.forEach(async(outlet: IonRouterOutlet) => {
      if (this.router.url === '/intro') {
          if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
            this.lastTimeBackPress = new Date().getTime();
            //this.presentAlertConfirm();
            navigator['app'].exitApp();
          } 
        }
      });
    });
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: 'Are you sure you want to exit the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
  
    await alert.present();
  }

  async presentAlert(notification) {
    const confirmAlert = await this.alertCtrl.create({
      header: 'Live Service',
      message: JSON.stringify(notification),
      buttons: [{
        text: 'Ignore',
        role: 'cancel'
      }, {
        text: 'Watch Now',
        handler: () => {
          //TODO: Your logic here
          //self.nav.push(DetailsPage, {message: data.message});
          this.router.navigate(['/livetv/1'])
        }
      }]
    });
    confirmAlert.present();
  }


  async getVersionData()  {

            
    return new Promise(resolve => {
      let body = {
        //versiondata: "process_versiondata",
      }
      
      this.accessprvd.getData('version').subscribe((res:any) =>{
          if(res.status == true) { 
            this.data = res.versionone;
            this.androidversion = this.data.versions_androidnumber;
            this.iphoneversion = this.data.versions_iosnumber;
            console.log(this.data);

            this.updateAppForAndroid();

          } else {
          
          }
      },(err)=>{
          console.log(err);
      });
  
    });
  
  
  }

  async updateAppForAndroid() {
    
    //this.info = await Device.getInfo();
    this.currentversion = this.androidversion;

    //console.log(this.info.appVersion);
    //alert(this.currentversion);

    this.info = "2.30";

    if(this.currentversion != this.info) {
       this.getVersion();
    }  
     
  }



  async openAppStore() {
    if(this.platform.is('android')) {
      await App.openUrl({ url:'https://play.google.com/store/apps/details?id=com.aam.kccconline'});
    } else if(this.platform.is('ios')) {
      await App.openUrl({ url:'https://apps.apple.com/us/app/ade-ajala-ministries/id1541697624'});
    }
  }


  async getVersion() {
    //const info = await Device.getInfo();
    const confirmAlert = await this.alertCtrl.create({
      header: 'New App Update',
      backdropDismiss: false,
      //message: JSON.stringify(info.appVersion),
      message: JSON.stringify('A new version of this app is available' ),
      buttons: [{
        text: 'Update',
        handler: () => {
          //TODO: Your logic here
          //self.nav.push(DetailsPage, {message: data.message});
           this.openAppStore();
        }
        
      }, {
        text: '=>',
        handler: () => {
          //TODO: Your logic here
          //self.nav.push(DetailsPage, {message: data.message});
           this.openAppStore();
        }
      }]
    });
    confirmAlert.present();
  }


}


