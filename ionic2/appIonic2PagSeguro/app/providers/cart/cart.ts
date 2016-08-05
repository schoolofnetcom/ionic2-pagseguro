export class Cart {
  items: Array<any> = [];
  total = 0;

  addItem(item){
    this.items.push(item);
    this.calculateTotal();
  }

  calculateTotal(){
    let total = 0;
    this.items.forEach(item => { total += Number(item.price); this.total = total; });
  }

}

