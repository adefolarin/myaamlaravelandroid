import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router,  ActivatedRoute } from '@angular/router';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  cat: string;

  id: any;

  name: string = "";
  pnum: string = "";
  email: string = "";
  amount: any = "";

  disabledButton: any;

 constructor(
   private modalController: ModalController, 
   private route: Router,
   private activatedroute: ActivatedRoute,
   private payPal: PayPal,
   private navCtrl: NavController,
    private accessserv: ServiceService,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
      this.id = this.activatedroute.snapshot.paramMap.get('id');
      if(this.id == "1") {
        this.cat = "TITHE";
      }
      else if(this.id == "2") {
        this.cat = "OFFERING";
      }
      else if(this.id == "3") {
        this.cat = "OTHERS";
      }

      //this.payWithPayPal();
  }
 
 
  async payWithPayPal() {

    if(this.name == "") {
      this.presentToast("Name is required","danger");
    } else if(this.email == "") {
      this.presentToast("Email is required","danger");
    } else if(this.pnum == "") {
      this.presentToast("Phone Number is required","danger");
    } else if(this.amount == "") {
      this.presentToast("Enter the amount you are giving","danger");
    }

   else {
     
    const loader = await this.loadingCtrl.create({
      message: "Please wait......",
    });

    this.payPal.init({
      PayPalEnvironmentProduction: 'AUAlnVBm7VdT4yxnNR205iWPDnHmVAgJSGxnrUmIfmdpMpyxCNimnE-AaT1ajXDBmoOS8BL8YedDXA1P',
      PayPalEnvironmentSandbox: 'AetRC7WA2vtXTmIzJ-vV87oGNLMGHnSdq1DUrfUaqmqbDvDSTujPDR8hDq9XzS8wjzST4HrLrbY0vjGi'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.amount, 'USD', this.cat, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((resp:any) => {


          if(resp.response.state == "approved") {
              loader.present();

              return new Promise(resolve => {
                let body = {
                  payment: 'process_payment',
                  donationtype: this.cat,
                  name: this.name,
                  email: this.email,
                  pnum: this.pnum,
                  amount: this.amount
                }
                
                this.accessserv.postData(body, 'payment-api.php').subscribe((res:any) =>{
                  if(res.success == true) {
                    console.log(res);
                    loader.dismiss();
                    this.presentToast("Payment Succesful","success");
                  } else {
                    
                  }
                },(err)=>{
                    console.log(err);
                });
      
            });
        }
          // Successfully paid
    
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });

   }
      
  }



  async presentToast(a,color) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 2000,
      position: 'middle',
      color:color,
    });
    toast.present();
  }





 }
