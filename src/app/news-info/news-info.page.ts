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
  selector: 'app-news-info',
  templateUrl: './news-info.page.html',
  styleUrls: ['./news-info.page.scss'],
})
export class NewsInfoPage implements OnInit {

  blogname: string;
  blogcontent: string;
  blogdate: string;
  blogtime: string;
  blogdata: any;
  imgurl:SafeResourceUrl;

  id: any;

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
    private DomSanitizer:DomSanitizer,
    private activatedroute: ActivatedRoute) { }
  

    ngOnInit() {
      this.id = this.activatedroute.snapshot.paramMap.get('id');
      this.loadNews(this.id);
    }
  
  
    async loadNews(myid) {

      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
       
      return new Promise(resolve => {
         let body = {
          //blogdetail: "process_blogdetail",
          news_id: myid 
         }
         
         this.accessserv.getData('news/' + myid).subscribe((res:any) =>{
            if(res.status == true) {
              loader.dismiss();
              console.log(res.newsone);
              this.blogdata = res.newsone;
              this.blogname = this.blogdata.news_title;
              this.blogcontent = this.blogdata.news_content;
              this.blogdate = this.blogdata.news_date;
              //this.blogtime = this.blogdata.blogtime;          
            } else {
              this.presentAlert("No News For Now");
              console.log("Error in loading news");
            }
         },(err)=>{
             this.presentAlert("No News For Now");
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


}
