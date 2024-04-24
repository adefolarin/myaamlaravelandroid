import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';
import { Observable } from 'rxjs/Observable';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {DomSanitizer,SafeResourceUrl} from "@angular/platform-browser";
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-mytest',
  templateUrl: './mytest.page.html',
  styleUrls: ['./mytest.page.scss'],
})
export class MytestPage implements OnInit {

  datastorage: any;
  name: string;
  blogdata: any;
  app_url;

  userid: any;


  id: string;
  singlevideos: Observable<any>;

  singlevideos2: Observable<any>;

  servicedata: any;

  tvdata: any;

  servicebooltrue:boolean;
  serviceboolfalse:boolean;
  tvbooltrue:boolean;
  tvboolfalse:boolean;

  fallbackbool:boolean;

  nonetwork:boolean;

  siteurl:SafeResourceUrl;

  bool1: boolean;
  bool2: boolean;

  constructor(private router: Router, 
    private navCtrl: NavController,
  	private accessserv: ServiceService,
    private storage: Storage,
    private storage2: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private iab: InAppBrowser,
    public social: SocialSharing,
    private DomSanitizer:DomSanitizer,
    private network: Network,) { 
  
    
    }

  ngOnInit() {
    this.singleVideo();
    this.singleVideo2();
    this.liveService();
    this.liveTv();



      this.network.onDisconnect().subscribe(() => {
        this.nonetwork = true;
        //alert("Hello there");
        
      });

      this.network.onConnect().subscribe(() => {
        
        setTimeout(()=>{
          this.nonetwork = false;
        },200);
        
        
      });

    
 
    
    }

    

 

  ionViewDidEnter() {

    /*setInterval(()=> {
      this.singleVideo(); this.singleVideo2() 
    },4000); */

    
  }


  async liveService() {
       
    return new Promise(resolve => {
       let body = {
         liveservice: "process_liveservice",
       }
       
       this.accessserv.postData(body, 'liveservice-api.php').subscribe((res:any) =>{
          if(res.success == true) {
            console.log(res.result);
            this.servicedata = res.result;
            this.servicedata = this.servicedata.liveservicestatus;

          } else {
            
            console.log("Error in fetching live service");
          }
       },(err)=>{
           console.log(err);
       });

    });

 
}


async liveTv() {
       
  return new Promise(resolve => {
     let body = {
       livetv: "process_livetv",
     }
     
     this.accessserv.postData(body, 'livetv-api.php').subscribe((res:any) =>{
        if(res.success == true) {
          console.log(res.result);
          this.tvdata = res.result;
          this.tvdata = this.tvdata.livetvstatus;

        } else {
          
          console.log("Error in fetching live tv");
        }
     },(err)=>{
         console.log(err);
     });

  });


}


 async singleVideo() {
  this.singlevideos = this.accessserv.getLiveVideos();
  this.singlevideos.subscribe(data => {
    //console.log('singlevideolist: ', data);

    if(data.items.length == 1) {
      console.log("Available");
      this.servicebooltrue = true;
    } else if(data.items.length == 0) {
      console.log("Not Available");
      this.serviceboolfalse = false;
    } else if(!data) {
      this.bool1 = false;
    }

  }, async err => {
      console.log(err);

  });
}


async singleVideo2() {
  this.singlevideos2 = this.accessserv.getLiveVideos2();
  this.singlevideos2.subscribe(data => {
    if(data.items.length == 1) {
    console.log('singlevideolist2: ', data);
      console.log("Available");
      this.tvbooltrue = true;
    } else if(data.items.length == 0) {
      console.log("Not Available");
      this.tvboolfalse = false;
    } else if(!data) {
      this.bool2 = false;
    }

    /*if(data.items.length == 1) {
      console.log("Available");
      this.test = !this.test;
    } else if(data.items.length == 1) {
      console.log("Not Available");
      this.test = this.test;
    }*/

  }, async err => {
      console.log(err);
      this.nonetwork = true;
  });

}

    


    liveservice() {
      this.navCtrl.navigateForward('/livetv/1');
    }

    livetv() {
      //this.navCtrl.navigateForward(['/livetv2/1']);
      this.platform.ready().then(() => {
        let browser = this.iab.create("https://www.techtracenigeria.com.ng");
     });
    }

    nolivetv() {
      this.router.navigate(['/nolivetv']);
    }

}
