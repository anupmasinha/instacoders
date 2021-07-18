import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions ={
  headers: new HttpHeaders({
    'Accept': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  baseUrl: string;

  
  constructor(private http: HttpClient) {
    this.baseUrl = 'http://instagrocer.ca/igadmin/api/';
  }

 
  homePageBannerSlider(){
    return this.http.get(this.baseUrl +'get-banner/home-banner', httpOptions)
  }
}
