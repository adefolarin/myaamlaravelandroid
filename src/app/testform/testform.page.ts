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
  selector: 'app-testform',
  templateUrl: './testform.page.html',
  styleUrls: ['./testform.page.scss'],
})
export class TestformPage implements OnInit {

  siteurl:SafeResourceUrl;

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
    private DomSanitizer:DomSanitizer,) { }

  ngOnInit() {
    this.testform();
  }


  testform() {
    this.siteurl  = this.DomSanitizer.bypassSecurityTrustResourceUrl("https://forms.gle/xxvpbnQL1bZu6sms5"); 
  }Init() {
  }

}
