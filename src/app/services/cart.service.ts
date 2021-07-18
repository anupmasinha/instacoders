import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {environment as env} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService { 
  storedCart = [];
  cartcount:number;
  crtcountAr = [];
  addOns = [];
  varientOpt = [];
  productExist:boolean;
  foundProd:any[];
  cartvaliReturn:{};


  constructor(private http:HttpClient,private router:Router) { }


  checkCart(pArr:{}){
    this.storedCart = JSON.parse(localStorage.getItem("cartData"));

    if(this.storedCart){
      if(this.storedCart.length > 0){
        //console.log('Reached in main cond1');
        this.foundProd = this.storedCart.filter(elm => elm.pId == pArr['pId']);
        if(this.foundProd.length > 0){
          this.foundProd.map((fEl, index) =>{
            //Checking for Variations 
            if(fEl.varients.length > 0){
              var varrslt = this.checkCartVariations(fEl.varients, pArr['varients']);
              //console.log(varrslt);
            }

            // Checking for Adons 
            if(fEl.addons.length > 0){
              var adnrslt = this.checkCartAdons(fEl.addons, pArr['addons']);
              //console.log(adnrslt);
            }

            if(varrslt == false || adnrslt == false){
              //console.log('Add the product here');
              this.cartvaliReturn = {'result':'add',  'data':''};
            }else{
              //console.log('Update the product here');
              this.cartvaliReturn = {'result':'update', 'cid':fEl.sno, 'data':fEl};
            }
            return;
          });          
        }else{
          //console.log('Reachelse hem');
          this.cartvaliReturn  = {'result':'add', 'data':''};
        }
      }
    }else{
      //console.log('Reached in main else');
      this.cartvaliReturn  = {'result':'add', 'data':''};
      return;
    }
  }


  checkCartVariations(cVArr:any[], pVArr:any[]){
    let lcVarr = cVArr.map((el)=> el.optvalueid);
    let lpVarr = pVArr.map((el)=> el.optvalueid);

    if (lcVarr.length !== lpVarr.length) return false;
    const uniqueValues = new Set([...lcVarr, ...lpVarr]);
    
    for (const uv of uniqueValues) {
      const cCount = lcVarr.filter(e => e === uv).length;
      const pCount = lpVarr.filter(e => e === uv).length;
      if (cCount !== pCount) return false;
    }
    return true;
  }


  checkCartAdons(cVArr:any[], pVArr:any[]){
    let lcVarr = cVArr.map((el)=> el.valueid);
    let lpVarr = pVArr.map((el)=> el.valueid);

    if (lcVarr.length !== lpVarr.length) return false;
    const uniqueValues = new Set([...lcVarr, ...lpVarr]);
    
    for (const uv of uniqueValues) {
      const cCount = lcVarr.filter(e => e === uv).length;
      const pCount = lpVarr.filter(e => e === uv).length;
      if (cCount !== pCount) return false;
    }
    return true;
  }


}
