import { Component, EventEmitter, Output } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwarePart } from '../hardware-shop.component';

@Component({
  selector: 'app-hardware-shop-cart',
  templateUrl: './hardware-shop-cart.component.html',
  styleUrls: ['./hardware-shop-cart.component.scss']
})
export class HardwareShopCartComponent {

  protected items: HardwarePart[];

  constructor(
    private hardwareShopService: HardwareShopService
  ) {
    this.items = this.hardwareShopService.getCartItems();
    console.log(this.items);
  }
}
