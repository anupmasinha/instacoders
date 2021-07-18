import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment as env} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService { 

  constructor(private http:HttpClient) { }


  getCats(){ 
    return this.http.get<any>(env.apiurl+'getallcats', {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );

  }

  getsubCats(catslug){
    return this.http.get<any>(env.apiurl+'get-subcats-by-slug/'+catslug, {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );
  }


  getprodbyCatslug(catslug){
    return this.http.get<any>(env.apiurl+'get-prod-by-cat-slug/'+catslug, {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );
  }

  getAllproducts(){
    return this.http.get<any>(env.apiurl+'product-list', {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );
  }


  getProductDetail(pslug){
    return this.http.get<any>(env.apiurl+'get-prod-by-slug/'+pslug, {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );
  }

  //product search
  searchProduct(pslug){
    return this.http.get<any>(env.apiurl+'product-search/'+pslug, {})
      .pipe(map(data => {
        if (data) {            
          return data;
        }
      }),
    );
  }




}
