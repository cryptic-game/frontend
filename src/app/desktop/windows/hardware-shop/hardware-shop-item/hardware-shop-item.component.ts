import { Component, Input } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwarePart } from '../hardware-shop.component';

@Component({
  selector: 'app-hardware-shop-item',
  templateUrl: './hardware-shop-item.component.html',
  styleUrls: ['./hardware-shop-item.component.scss']
})
export class HardwareShopItemComponent {

  @Input() item: HardwarePart;

  constructor(
    private hardwareShopService: HardwareShopService
  ) {
  }

  addToCart(): void {
    this.hardwareShopService.addCartItem(this.item);
  }
}
