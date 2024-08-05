import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController, AlertController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';
import { Observable } from 'rxjs/Observable';
import {DomSanitizer,SafeResourceUrl} from "@angular/platform-browser";
import { importType } from '@angular/compiler/src/output/output_ast';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
const { Network } = Plugins;
const { Share } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slider', { static: false }) slider: IonSlides;

  datastorage: any;
  name: string;
  blogdata: any;
  app_url;

  userid: any;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };

  id: string;
  singlevideos: Observable<any>;

  singlevideos2: Observable<any>;

  servicebooltrue:boolean;
  serviceboolfalse:boolean;
  tvbooltrue:boolean;
  tvboolfalse:boolean;

  fallbackbool:boolean;

  nonetwork:boolean;

  siteurl:SafeResourceUrl;

  bool1: boolean;
  bool2: boolean;

  data: any;

  info:any;
  currentversion: any;

  androidversion: any;
  iphoneversion: any;

  constructor(private router: Router, 
    private navCtrl: NavController,
  	private accessserv: ServiceService,
    private storage: Storage,
    private storage2: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private DomSanitizer:DomSanitizer,
   ) { 
  
    
    }

  ngOnInit() {
    this.loadBlog();

    this.storage.get('session_1').then(res=>{
      console.log(res);
      this.datastorage = res;
      this.name = this.datastorage.name;
      this.userid = this.datastorage.userid;
    });

    /*this.storage2.get('session_2').then(res=>{
      console.log(res);
      this.datastorage = res;
      this.name = this.datastorage.name;
    });*/



    
 
    
    }

    

ionViewWillEnter(){
   this.slider.stopAutoplay();  
} 

  ionViewDidEnter() {

    /*setInterval(()=> {
      this.singleVideo(); this.singleVideo2() 
    },4000); */
     this.slider.startAutoplay();
    
  }


  async myuserstorage() {
    await this.storage.get('session_1').then(res=>{
      this.userid = this.datastorage.userid;
    });
    return this.userid;
  }

    async logout() {
    await this.storage.clear();
    //await this.storage2.clear();
    await this.router.navigate(['/sign-in']);
    const toast = await this.toastCtrl.create({
     message: "You have logged out successfully",
     duration: 1500
   });
   await toast.present();
 }



  mykcile() {
      //this.router.navigate(['/kcile']);
      this.navCtrl.navigateForward('/kcile');
  }  
  bible() {
      //this.router.navigate(['./bible']);
      //this.platform.ready().then(() => {
        //let browser = this.iab.create("https://www.bible.com");
     //});
      Browser.open({ url: 'https://www.bible.com' });
      
  }  
  podcast() {
      this.router.navigate(['./podcast']);
    } 
  news() {
      this.router.navigate(['/news']);
    }  
  playlists() {
      this.router.navigate(['./playlists']);
    }
    
  movies() {
      this.router.navigate(['./movies']);
  }
  prayers() {
      this.router.navigate(['./prayers']);
    }  
  find_church() {
      this.router.navigate(['./find-church']);
  } 
  events() {
    this.router.navigate(['./events']);
  } 
  programs() {
    this.router.navigate(['./programs']);
  }  
  feedback() {
    this.router.navigate(['./feedback']);
  }

  mytest() {
    this.router.navigate(['./mytest']);
  }

  give() {
    //this.router.navigate(['./give']);
    //Browser.open({ url: 'http://localhost:8000/mobiledonation'});

     //this.platform.ready().then(() => {
      //let browser = this.iab.create("https:/adeajalaministries.org/kcccbackend/mobiledonation");
     //});
    //this.router.navigate(['/give']);
     Browser.open({ url: 'https:/adeajalaministries.org/kcccbackend/mobiledonation' });
  }

  website() {
      /*this.platform.ready().then(() => {
      let browser = this.iab.create("https://www.kccconline.org/");

      });*/
      this.router.navigate(['/website']);
    
  }

  shareapp() {
    if(this.platform.is('android')) {
      this.app_url = "https://play.google.com/store/apps/details?id=com.aam.kccconline";
    } else if(this.platform.is('android')) {
      this.app_url = "https://play.google.com/store/apps/details?id=com.aam.kccconline"; 
    }
    Share.share({url: this.app_url,dialogTitle: 'Share with Friends'});
  }


    
  
    async loadBlog() {
     
         return new Promise(resolve => {
            //let body = {
              //blog: "process_blog",
            //}
            
            this.accessserv.getData('news').subscribe((res:any) =>{
               if(res.news != null) {
                 this.blogdata = res.news;
                 console.log(this.blogdata)
               } else {
                 console.log("Error in loading blog");
               }
            },(err)=>{
                console.log(err);
            });
  
         }); 
      
    }



    liveservice() {
      this.navCtrl.navigateForward('/countdown');
    }

    livetv() {
      //this.navCtrl.navigateForward(['/livetv2/1']);
      //this.platform.ready().then(() => {
        //let browser = this.iab.create("https://aam.kccconline.org");
      //});
      Browser.open({ url: 'https://aam.kccconline.org' });
    }


    
    
}
