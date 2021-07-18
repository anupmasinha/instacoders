import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../services/common.service';
import { CartService } from '../services/cart.service';
import { environment as env } from '../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @ViewChild('cmodel') cmodel;
  @ViewChild('closeBtn') closeBtn;
  @ViewChild('closeBtnModal2') closeBtnModal2;
  cats = [];
  subCats = [];
  productList = [];
  storedCart = [];
  mProds: any = [];
  imgurl: string;
  mprodName: string;
  mprodImg: any;
  mprodPrice: number;
  qty: any;
  mVariation = [];
  finalprice: any;
  addOnprice: any;
  optionPrice: any;
  newPrice: any;
  baseprice: any;
  isVariation: boolean;
  cartMsg: string;
  cartMsg_ar: string;
  productExist: boolean;
  isProdClicked: boolean;
  rprodid: number;
  pqty: number;
  cartData = [];
  cartCount: number;
  varientOpt = [];
  addOns = [];
  cartTotalPrice: any;
  showLang: string;
  seletedFr: string;
  seletedEn: string;
  englishLang: string;
  frenchLang: string;
  engLang: boolean = false;
  frenchLangs: boolean = false;


  constructor(public CommonService: CommonService, private router: Router,
    private route: ActivatedRoute, private el: ElementRef,
    private srvcart: CartService, private langObj: LanguageService,
    public translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    this.langObj.langStr.subscribe((data) => {
      this.showLang = data;
    });

  }

  ngOnInit(): void {
    this.changLang();
    this.seletedFr = '';
    this.seletedEn = '';
    this.showLang = localStorage.getItem("showLang");
    if (this.showLang == null && this.showLang == undefined) {
      this.showLang = 'en';
      this.engLang = true
    }
    this.translate.use(this.showLang);
    if (this.showLang == 'en') {
      this.seletedEn = 'selected';
      this.engLang = true
    }
    if (this.showLang == 'fr') {
      this.seletedFr = 'selected';
      this.frenchLangs = true
    }


    this.imgurl = env.imgurl;
    this.qty = 1;
    this.addOnprice = 0;

    //get all categories
    this.CommonService.getCats().subscribe((data: any) => {
      this.cats = data.data;
    });

    //get all products

    this.CommonService.getAllproducts().subscribe((data: any) => {
      this.productList = data.data;
      console.log(this.productList);
    });


    this.route.queryParams.subscribe((qryprm => {
      //this.productList = [];
      console.log(qryprm);
      var pName = qryprm['search'];
      if (pName != undefined) {
        this.CommonService.searchProduct(pName).subscribe((data: any) => {
          this.productList = data.data;
        });
      }


    }));


    this.route.params.subscribe((params: Params) => {
      var catslug = params['catslug'];

      if (params['cats'] == 'cats') {
        this.CommonService.getsubCats(catslug).subscribe((data: any) => {
          this.subCats = data.data;
        });

        this.CommonService.getprodbyCatslug(catslug).subscribe((data: any) => {
          this.productList = data.data;
        });

      } else if (params['cats'] == 'subcat') {
        this.CommonService.getprodbyCatslug(catslug).subscribe((data: any) => {
          this.productList = data.data;
        });
      }

    });


  }

  openModel(pslug) {
    //getProductDetail 
    this.CommonService.getProductDetail(pslug).subscribe((data: any) => {
      console.log(data.data);
      this.mProds = data.data;
      this.finalprice = this.mProds.price;
      console.log(this.finalprice);
      this.baseprice = this.mProds.price;
      this.isVariation = data.data.is_variation;
    });

  }

  addtoCart(mProds, qty, finalprice) {

    var priceWithaddon = ((finalprice) / qty).toFixed(2);
    console.log(priceWithaddon);
    var produrl = this.router.url;
    let prodArray = {
      "pName": mProds.pName,
      "pName_ar": mProds.pName_ar,
      "pId": mProds.id,
      "pImage": mProds.pImage,
      "pslug": mProds.pSlug,
      //"catslug":mProds.pslug,
      "pUrl": mProds.produrl,
      "basePrice": mProds.price,
      "totalPrice": finalprice,
      "priceWithaddon": priceWithaddon,
      "qty": qty,
      "addons": this.addOns,
      "varients": this.varientOpt,
    };

    //console.log(prodArray);

    this.srvcart.checkCart(prodArray);
    console.log('Final result');
    console.log(this.srvcart.cartvaliReturn);

    this.storedCart = JSON.parse(localStorage.getItem("cartData"));
    if (this.srvcart.cartvaliReturn['result'] == 'add') {
      if (this.storedCart != null && this.storedCart.length > 0) {
        localStorage.setItem("cartData", JSON.stringify(this.storedCart));
        this.storedCart.push(prodArray);
        localStorage.setItem("cartData", JSON.stringify(this.storedCart));
      } else {
        var cartArray = [];
        cartArray.push(prodArray);
        localStorage.setItem("cartData", JSON.stringify(cartArray));
      }

    }


    if (this.srvcart.cartvaliReturn['result'] == 'update') {
      var cartPos = this.srvcart.cartvaliReturn['cid'];
      for (var i = 0; i < this.storedCart.length; i++) {
        if (this.storedCart[i].sno == cartPos) {
          this.storedCart[i].qty = this.storedCart[i].qty + 1;
          this.storedCart[i].totalPrice = this.storedCart[i].priceWithaddon * this.storedCart[i].qty;
          localStorage.setItem("cartData", JSON.stringify(this.storedCart));
          break;
        }

      }
    }


    this.storedCart = JSON.parse(localStorage.getItem("cartData"));
    this.cartCount = this.storedCart.length;
    this.closeBtnModal2.nativeElement.click();
    this.cartTotalPrice = 0;
    for (var j = 0; j < this.storedCart.length; j++) {
      this.cartTotalPrice = (parseFloat(this.cartTotalPrice) + parseFloat(this.storedCart[j].totalPrice)).toFixed(2);

    }


    //console.log(this.cartTotlaP);

  }


  checkvarient(mProds, qty, finalprice) {
    if (this.isVariation) {
      console.log('open a new model');
      this.closeBtn.nativeElement.click();
      this.cmodel.nativeElement.click();
    } else {
      console.log('add to cart');
      //this.addtoCart(mProds, qty, finalprice)
    }

  }

  prodClicked(pid) {
    console.log(pid);
    this.isProdClicked = true;
    this.pqty = 1;
    this.cartData = JSON.parse(localStorage.getItem('cart'));
    if (this.cartData != null) {
      this.cartData.push(pid);
      localStorage.setItem('cart', JSON.stringify(this.cartData));


    } else {
      var cartArray = [];
      cartArray.push(pid);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      this.cartData = JSON.parse(localStorage.getItem('cart'));

    }

    this.cartCount = this.storedCart.length;



  }


  incQty(qty, price) {
    this.qty = parseInt(qty) + 1;
    if (this.addOns.length > 0 || this.varientOpt.length > 0) {
      this.productTotal(this.addOns, this.varientOpt)
    } else {
      this.finalprice = (this.qty * parseFloat(price)).toFixed(2);
    }

  }

  desQty(qty, price) {
    if (qty > 0) {
      if (qty == 1) {
        if (this.addOns.length > 0 || this.varientOpt.length > 0) {
          this.productTotal(this.addOns, this.varientOpt)
        } else {
          this.finalprice = parseFloat(price).toFixed(2);
        }

      } else {
        this.qty = parseInt(qty) - 1;
        if (this.addOns.length > 0 || this.varientOpt.length > 0) {
          this.productTotal(this.addOns, this.varientOpt)
        } else {
          this.finalprice = ((qty * parseFloat(price)) - parseFloat(price)).toFixed(2);
        }

      }
    }
  }




  onsearchsubmit(frm: NgForm) {
    let searchterm = frm.value.searchtxt;
    this.router.navigate(['products'], { queryParams: { search: searchterm } });

  }

  optionValueTtl() {
    this.varientOpt = [];
    let selctchk = this.el.nativeElement.querySelectorAll('.optnchk:checked');

    for (const rb of selctchk) {
      let optionname = rb.getAttribute('optnname');
      let optionname_ar = rb.getAttribute('optnname_ar');
      let optionid = rb.getAttribute('optnid');
      let optvaluename = rb.getAttribute('optnvalue');
      let optvaluename_ar = rb.getAttribute('optnvalue_ar');
      let productId = rb.getAttribute('pid');
      let optPrice = rb.getAttribute('price');
      let ovQty = rb.getAttribute('qty');
      //this.prodQty = rb.getAttribute('qty');
      let optvalueid = rb.value;
      let optionArray = {
        "orderitem_id": productId,
        "optionname": optionname,
        "optionname_ar": optionname_ar,
        "optionid": optionid,
        "optvaluename": optvaluename,
        "optvaluename_ar": optvaluename_ar,
        "optvalueid": optvalueid,
        "ovprice": optPrice,
        "ovqty": ovQty
      };
      this.varientOpt.push(optionArray);
    }

    this.productTotal(this.addOns, this.varientOpt);
  }

  chkoptvl(e) {
    this.optionValueTtl();
    console.log(this.varientOpt);
  }

  //check addons
  chkadonvl(e) {
    var amt = e.value;
    var addonName = e.getAttribute('adonName');
    var adonId = e.getAttribute('adonid');
    var valueName = e.getAttribute('valuename');
    var valueName_ar = e.getAttribute('valuename_ar');
    var valueId = e.getAttribute('valueid');
    var productId = e.getAttribute('pid');
    var addonPrice = e.value;
    var addonQty = e.getAttribute('qty');
    //this.prodQty = addonQty;

    let addonArray = {
      "orderitem_id": productId,
      "addonname": addonName,
      "addonid": adonId,
      "valuename": valueName,
      "valuename_ar": valueName_ar,
      "valueid": valueId,
      "addonprice": addonPrice
    };

    if (e.checked) {
      this.addOns.push(addonArray);
    } else {
      for (var i = 0; i < this.addOns.length; i++) {
        if (addonArray.valueid == this.addOns[i].valueid) {
          this.addOns.splice(i, 1);
        }
      }
    }

    console.log(this.addOns);
    this.productTotal(this.addOns, this.varientOpt);
  }


  productTotal(addOn, option) {
    console.log('option');
    console.log(option);

    console.log('oddon');
    console.log(addOn);

    if (addOn != '') {
      this.addOnprice = 0;
      for (var i = 0; i < addOn.length; i++) {
        this.addOnprice = (parseFloat(this.addOnprice) + parseFloat(addOn[i]['addonprice'])).toFixed(2);
      }
    } else {
      this.addOnprice = 0;
    }

    if (option != '') {
      this.optionPrice = 0;
      for (var j = 0; j < option.length; j++) {
        //this.optionPrice = (parseFloat(this.optionPrice) + (parseFloat(option[j]['ovprice']) * parseFloat(option[j]['ovqty']))).toFixed(2);
        this.optionPrice = (parseFloat(this.optionPrice) + (parseFloat(option[j]['ovprice']))).toFixed(2);
      }
    } else {
      this.optionPrice = 0;
    }

    console.log('this.baseprice');
    console.log(this.baseprice);

    console.log('this.addOnprice');
    console.log(this.addOnprice);

    console.log('this.optionPrice');
    console.log(this.optionPrice);


    this.newPrice = (parseFloat(this.baseprice) + parseFloat(this.addOnprice) + parseFloat(this.optionPrice)).toFixed(2);
    console.log(this.newPrice);
    console.log(this.qty);
    this.finalprice = (this.newPrice * this.qty).toFixed(2);

    // console.log(' baseprice is - '+this.baseprice);
    // console.log('addOnprice Price is - '+this.addOnprice);
    // console.log('optionPrice Price is - '+this.optionPrice);
    // console.log('New Price is - '+this.newPrice);
    // console.log('Final Price  is - '+this.finalprice);
  }


  //language transale dropdown

  useLanguage(language: string) {
    this.showLang = language;
    if (language == 'fr') {
      localStorage.setItem("showLang", language);
      this.changLang();
    }
    if (language == 'en') {
      localStorage.setItem("eng", language);
      this.changLang();
    }
    this.translate.use(language);
    this.langObj.langStr.emit(this.showLang);
  }
  changLang() {
    this.englishLang = localStorage.getItem('eng')
    this.frenchLang = localStorage.getItem('showLang')
    if(this.showLang == 'en'){
      this.engLang = true;
      this.frenchLangs = false;
      localStorage.removeItem('showLang');
    }
    if(this.showLang == 'fr'){
      this.engLang = false;
      this.frenchLangs = true;
      localStorage.removeItem('eng');
    }
  }
}
