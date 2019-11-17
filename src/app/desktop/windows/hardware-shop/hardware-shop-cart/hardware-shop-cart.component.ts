import { Component } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwarePart } from '../hardware-shop.component';

@Component({
  selector: 'app-hardware-shop-cart',
  templateUrl: './hardware-shop-cart.component.html',
  styleUrls: ['./hardware-shop-cart.component.scss']
})
export class HardwareShopCartComponent {

  items: HardwarePart[];
  morphCoins: number;
  hasEnoughMorphCoins: boolean;

  constructor(
    private hardwareShopService: HardwareShopService
  ) {
    this.items = this.hardwareShopService.getCartItems();
    this.hardwareShopService.getMorphCoins()
      .then(data => this.morphCoins = data)
      .catch(() => this.morphCoins = 0);
  }

  getHoleMorphCoins(): number {
    let mc = 0;
    this.items.forEach(item => mc += item.price * item.number);
    this.hasEnoughMorphCoins = this.morphCoins >= mc && mc !== 0;
    return mc;
  }

  updateNumber(): void {
    this.hardwareShopService.setCartItems(this.items);
  }

  update(): void {
    this.items = this.hardwareShopService.getCartItems();
  }

  buy(): void {
    this.hardwareShopService.buyCart();
  }
}
