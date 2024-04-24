import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  name: string = "";
  pnum: string = "";
  email: string = "";
  message: string = "";
  subject: string = "";

  disabledButton;

  constructor(private router: Router, 
    private navCtrl: NavController,
  	private accessserv: ServiceService,
  	private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }

 
  async contact() {
    if(this.name == "") {
      this.presentToast("Name is required","danger");
    } else if(this.email == "") {
      this.presentToast("Email is required","danger");
    } else if(this.pnum == "") {
      this.presentToast("Phone number is required","danger");
    } else if(this.subject == "") {
      this.presentToast("What is the subject of your message?","danger");
    }  else if(this.message == "") {
      this.presentToast("What are your enquiries?","danger");
    } else {

      
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //contact: 'process_contact',
            contact_subject: this.subject,
            contact_name: this.name,
            contact_pnum: this.pnum,
            contact_email: this.email,
            contact_message: this.message
          }
          
          this.accessserv.postData(body, 'contact').subscribe((res:any) =>{
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
              this.presentAlert('Timeout');
              console.log(err);
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
        }, {
          text: 'Try Again',
          handler: () => {
            this.contact();
          }
        }
      ]
    });
    await alert.present();
  } 

}
