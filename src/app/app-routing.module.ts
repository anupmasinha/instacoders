import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'products', component: ProductListComponent},
  {path:'products/:cats/:catslug', component:ProductListComponent},
  {path:'products/search/:pslug', component:ProductListComponent},
  {path: 'cart', component: CartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
