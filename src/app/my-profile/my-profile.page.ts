import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { Platform, NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  id: any;
  datastorage: any;
  userid: any = "";
  name: string = "";
  email: string = "";
  country: string = "";
  address: string = "";
  state: string = "";
  city: string = "";
  pnum: string = "";
  pass: string = "";

  disabledButton;

  userdata: any;

  events_tab: string = "profile";

  constructor(private router: Router, 
    private navCtrl: NavController,
  	private accessserv: ServiceService,
  	private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private activatedroute: ActivatedRoute
    ) {}

  ngOnInit() {
    this.storage.get('session_1').then(res=>{
      console.log(res);
      this.datastorage = res;
      this.id = this.datastorage.userid;
      this.loadUserData(this.id);
    });
    //this.id = this.activatedroute.snapshot.paramMap.get('id'); 
    
  }

  ionViewDidEnter() {
    this.disabledButton = false;
    
  } 

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }


  async loadUserData(myid) {
       
    return new Promise(resolve => {
       //let body2 = {
         //userdata: "process_userdata",
         //myid: myid, 
       //}
       
       this.accessserv.getData('aamusers/' + myid).subscribe((res:any) =>{
          if(res.aamusers != null) {
            console.log(res.aamusers);
            this.userdata = res.aamusers;
            this.userid = this.userdata.aamusers_id;
            this.name = this.userdata.aamusers_name;
            this.email = this.userdata.aamusers_email;
            this.pnum = this.userdata.aamusers_pnum;
            this.address = this.userdata.aamusers_address;
            this.country = this.userdata.aamusers_country;
            this.state = this.userdata.aamusers_state;
            this.city = this.userdata.aamusers_city;

          } else {
            this.presentAlert("Error in loading your data");
            this.router.navigate(['/home']);
            //console.log("Error in loading your data");
          }
       },(err)=>{
           this.presentAlert("You have to create an account to have access");
           this.router.navigate(['/home']);
           //console.log(err);
       });

    });

 
}


  async changeProfile() {
    if(this.name == "") {
      this.presentToast("Name is required","danger");
    } else if(this.address == "") {
      this.presentToast("Address is required","danger");
    } else if(this.state == "") {
      this.presentToast("State is required","danger");
    } else if(this.country == "") {
      this.presentToast("Country is required","danger");
    } else if(this.city == "") {
      this.presentToast("City is required","danger");
    } else {
     
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //updatedata: 'process_updatedata',
            aamusers_name: this.name,
            aamusers_id: this.userid,
            aamusers_country: this.country,
            aamusers_address: this.address,
            aamusers_state: this.state,
            aamusers_city: this.city,
          }
          
          this.accessserv.postData(body, 'aamupdateuser').subscribe((res:any) =>{
             if(res.status == true) {
               loader.dismiss();
               this.disabledButton = false;
               this.presentToast(res.message,"success");
             } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.message,"danger");
             }
          },(err)=>{
              loader.dismiss();
              this.disabledButton = false;
              this.presentAlert('Please Fill the Appropriate Field');
          });

       });

    }
  }



  async changeEmail() {
    if(this.email == "") {
      this.presentToast("Email is required","danger");
    } else {

      
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //updateemail: 'process_updateemail',
            aamusers_email: this.email,
            aamusers_id: this.userid,
          }
          
          this.accessserv.postData(body, 'aamupdateemail').subscribe((res:any) =>{
             if(res.status == true) {
               loader.dismiss();
               this.disabledButton = false;
               this.presentToast(res.message,"success");
             } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.message,"danger");
             }
          },(err)=>{
              loader.dismiss();
              this.disabledButton = false;
              this.presentAlert('Please Fill the Appropriate Field');
              console.log(err);
          });

       });

    }
  }



  async changePnum() {
    if(this.pnum == "") {
      this.presentToast("Phone number is required","danger");
    } else {

      
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //updatepnum: 'process_updatepnum',
            aamusers_pnum: this.pnum,
            aamusers_id: this.userid,
          }
          
          this.accessserv.postData(body, 'aamupdatepnum').subscribe((res:any) =>{
             if(res.status == true) {
               loader.dismiss();
               this.disabledButton = false;
               this.presentToast(res.message,"success");
             } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.message,"danger");
             }
          },(err)=>{
              loader.dismiss();
              this.disabledButton = false;
              this.presentAlert('Please Fill the Appropriate Field');
              console.log(err);
          });

       });

    }
  }



  async changePass() {
    if(this.pass == "") {
      this.presentToast("Password is required","danger");
    } else {

      
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //updatepass: 'process_updatepass',
            aamusers_password: this.pass,
            aamusers_id: this.userid,
          }
          
          this.accessserv.postData(body, 'aamupdatepassword').subscribe((res:any) =>{
             if(res.status == true) {
               loader.dismiss();
               this.disabledButton = false;
               this.presentToast(res.message,"success");
             } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.message,"danger");
             }
          },(err)=>{
              loader.dismiss();
              this.disabledButton = false;
              this.presentAlert('Please Fill the Appropriate Field');
          });

       });

    }
  }



  async presentToast(a,color) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'middle',
      color:color,
    });
    toast.present();
  }


  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          handler: (blah) => {
            console.log('Confirm Cancel: Cancelled');
          }
        },
      ]
    });
    await alert.present();
  }

}
