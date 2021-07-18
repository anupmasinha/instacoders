import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import {environment as env} from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import {LanguageService} from '../services/language.service';
import { HomeServiceService } from '../services/home-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showLang:string;
  seletedFr:string;
  seletedEn:string;
  bannerList: any;
  homepageBanner: boolean;
  homePageMsg: string;
  imgUrl: string;
  englishLang: string;
  frenchLang: string;
  constructor(public apiService:HomeServiceService, private langObj:LanguageService, public translate: TranslateService) {
    this.imgUrl = env.imgurl;
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    this.langObj.langStr.subscribe((data)=>{
      this.showLang = data;
    });
    this.englishLang = localStorage.getItem('eng')
    this.frenchLang = localStorage.getItem('showLang')
   } 

  ngOnInit(): void {
    this.homePageBannerApi();
    this.seletedFr='';
    this.seletedEn = '';
    this.showLang = localStorage.getItem("showLang");
     if(this.showLang == null && this.showLang == undefined){
      this.showLang = 'en';
     }
     this.translate.use(this.showLang);
     if(this.showLang == 'en'){
       this.seletedEn = 'selected';
     }
     if(this.showLang == 'fr'){
      this.seletedFr = 'selected';
    }

  }

    // banner list api
    homePageBannerApi() {
      this.apiService.homePageBannerSlider().subscribe(res => {
        if (res['data'].length) {
          this.bannerList = res['data']
          this.homepageBanner = false;
          this.homePageMsg = '';
        } else {
          this.homepageBanner = false;
          this.homePageMsg = 'Data not found!';
        }
      },
        err => {
          this.homepageBanner = false;
          this.homePageMsg = '500 Internal Server Error!';
        })
    }

}
