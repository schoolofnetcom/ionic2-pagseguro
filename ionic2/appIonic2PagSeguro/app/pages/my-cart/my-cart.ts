import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Cart} from "../../providers/cart/cart";
import {CheckoutPage} from "../checkout/checkout";

/*
  Generated class for the MyCartPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/my-cart/my-cart.html',
})
export class MyCartPage {
  constructor(private nav: NavController, private cart: Cart) {}

  goToCheckout(){
    this.nav.push(CheckoutPage);
  }
}
