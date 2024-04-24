import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';
import { Observable } from 'rxjs/Observable';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {DomSanitizer,SafeResourceUrl} from "@angular/platform-browser"

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
events_tab: string = "upcoming";
name: string;
calendardata: any;
imgurl:SafeResourceUrl;
  
constructor(private router: Router, 
  private navCtrl: NavController,
  private accessserv: ServiceService,
  private storage: Storage,
  private toastCtrl: ToastController,
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  public platform: Platform,
  private iab: InAppBrowser,
  public social: SocialSharing,
  private DomSanitizer:DomSanitizer,) { }

  ngOnInit() {
    //this.loadEvent();
  }

  ionViewDidEnter() {

    this.loadEvent();
    
  }


  async loadEvent() {

    const loader = await this.loadingCtrl.create({
      message: "Please wait......",
    });
    loader.present();
     
    return new Promise(resolve => {
       let body = {
         //calendar: "process_calendar",
       }
       
       this.accessserv.getData('event').subscribe((res:any) =>{
          if(res.status == true) {
            console.log(res.events);
            loader.dismiss();
            this.calendardata = res.events;
            if(this.calendardata == null) {
              loader.dismiss();
              this.presentAlert("No Events For Now");
            }          
          } else {
            loader.dismiss();
            this.presentAlert("No Events For Now");
            console.log("Error in loading calendar");
          }
       },(err)=>{
           loader.dismiss();
           this.presentAlert("No Events For Now");
           console.log(err);
       });

    });

 
}

  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          handler: () => {
            this.navCtrl.navigateForward('/home');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('/home');
          }
        }
      ]
    });
    await alert.present();
  }



  eventInfo(id:any) {
    this.navCtrl.navigateForward('/event-info/' + id);
  } 
}
