import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, Segment} from 'ionic-angular';
import {Cart} from "../../providers/cart/cart";
import {Http, Headers, RequestOptions} from "@angular/http";

declare var PagSeguroDirectPayment;

@Component({
    templateUrl: 'build/pages/checkout/checkout.html',
})
export class CheckoutPage implements OnInit {
    @ViewChild(Segment)
    segment:Segment;
    paymentMethods:Array<any> = [];
    paymentMethod = 'BOLETO';
    creditCard = {
        num: '',
        cvv: '',
        monthExp: '',
        yearExp: '',
        brand: '',
        token: ''
    };

    constructor(private nav:NavController,
                private cart:Cart,
                private ref:ChangeDetectorRef,
    private http: Http) {
    }

    ngOnInit():any {
        PagSeguroDirectPayment.getPaymentMethods({
            amount: this.cart.total,
            success: response => {
                let paymentMethods = response.paymentMethods;
                this.paymentMethods = Object.keys(paymentMethods).map((k) => paymentMethods[k]);
                this.ref.detectChanges();
                this.segment.ngAfterViewInit();
            }
        });
    }

    paymentCreditCard(){
        this.getCreditCardBrand();
    }

    getCreditCardBrand(){
        PagSeguroDirectPayment.getBrand({
            cardBin: this.creditCard.num.substring(0,6),
            success: response => {
                this.creditCard.brand = response.brand.name
                this.ref.detectChanges();
                this.getCreditCardToken();
            }
        });
    }

    getCreditCardToken(){
        PagSeguroDirectPayment.createCardToken({
            cardNumber: this.creditCard.num,
            brand: this.creditCard.brand,
            cvv: this.creditCard.cvv,
            expirationMonth: this.creditCard.monthExp,
            expirationYear: this.creditCard.yearExp,
            success: response => {
                this.creditCard.token = response.card.token
                this.ref.detectChanges();
                this.sendPayment();
            }
        });
    }

    sendPayment(){
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        this.http.post('http://localhost:8000/api/order', JSON.stringify({
            items: this.cart.items,
            token: this.creditCard.token,
            hash: PagSeguroDirectPayment.getSenderHash(),
            method: this.paymentMethod,
            total: this.cart.total
        }),options).toPromise().then(response => console.log(response));
    }
}
