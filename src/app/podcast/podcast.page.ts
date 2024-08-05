import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController, NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { ServiceService } from '../services/service.service';
import { Router, ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl} from "@angular/platform-browser"

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.page.html',
  styleUrls: ['./podcast.page.scss'],
})
export class PodcastPage implements OnInit {

  datastorage: any;
  name: string;
  podcastdata: any;

  constructor(private activatedroute: ActivatedRoute,
    private DomSanitizer:DomSanitizer,
    private accessserv: ServiceService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,) { }

  ngOnInit() {
    this.loadpodcast();
  }


  async loadpodcast() {

    const loader = await this.loadingCtrl.create({
      message: "Please wait......",
    });
    loader.present();
     
    return new Promise(resolve => {
       //let body = {
         //podcast: "process_podcast",
       //}
       
       this.accessserv.getData('podcast').subscribe((res:any) =>{
          if(res.status == true) {
            loader.dismiss();
            this.podcastdata = res.podcasts;
            console.log(this.podcastdata)
          } else {
            loader.dismiss();
            this.presentAlert("No Podcasts Found");
          }
       }, async err =>{
            loader.dismiss();
            const alert = await this.alertCtrl.create({
            header: 'Podcasts',
            message: 'No Podcasts found',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.navigateForward('/home');
                }
              }
            ],
          });
          await alert.present();
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

}
