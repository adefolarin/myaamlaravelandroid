import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage implements OnInit {

  catname: any;
  voltime: string;

  programdata: any;
  catdata: any;
 
  name: string = "";
  pnum: string = "";
  email: string = "";
  message: string = "";
  id:any;

  modules = [];
  mymodules: any;

  val: string = "";

  checkedItems = []

  disabledButton;

  //item:any;

  constructor(private router: Router, 
    private navCtrl: NavController,
  	private accessserv: ServiceService,
  	private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedroute.snapshot.paramMap.get('id');
    this.loadPrograms(this.id);

    for(let module of this.modules) {
      module.checked = true;
    }
    
 
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }


  isChecked(item,event) {
    if(event.currentTarget.checked == true) {
      this.checkedItems.push(item);
      if(this.checkedItems.length > 0) {
        this.val = "Checked";
      }    
    } else if(event.currentTarget.checked  == false) {
       this.checkedItems.pop();
       if(this.checkedItems.length == 0) {
        this.val = "";
      };
    }
  }



  async loadPrograms(id) {
       
    return new Promise(resolve => {
       let body = {
         //program: "process_program",
         volcategories_id: id
       }
       
       this.accessserv.getData('mobilevolform/' + id).subscribe((res:any) =>{
          if(res.status == true) {
            console.log(res.result);
            this.programdata = res.volforms;
            this.catdata = res.volcategories;
            this.catname = this.catdata.volcategories_name;
            for(let data of this.programdata) {
              this.modules.push({voldate:data.volforms_date,voltime:data.volforms_mobiletime,checked:'false'});

            }
            

          } else {
            //this.presentAlert2("No Programs For Now");
            console.log("Error in loading program forms");
          }
       },(err)=>{
           //this.presentAlert2("No Program For Now");
           console.log(err);
       });

    });

 
}

 
  async volunteer() {
    if(this.name == "") {
      this.presentToast("Name is required","danger");
    } else if(this.email == "") {
      this.presentToast("Email is required","danger");
    } else if(this.pnum == "") {
      this.presentToast("Phone number is required","danger");
    } else if(this.val == "") {
      this.presentToast("Please tick the time you will be available?","danger");
    } else {


      let finalmodules = this.modules.filter((x) => {
        return x.checked == true;
      })

      
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Please wait......",
      });
      loader.present();
      

       return new Promise(resolve => {
          let body = {
            //volunteer: 'process_volunteer',
            volunteers_type: this.catname,
            volunteers_name: this.name,
            volunteers_pnum: this.pnum,
            volunteers_email: this.email,
            selecteditem: finalmodules
          }

          console.log(body);
          
          this.accessserv.postData(body,'mobilevolunteer').subscribe((res:any) =>{
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
            this.volunteer();
          }
        }
      ]
    });
    await alert.present();
  }
  
  
  async presentAlert2(a) {
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
