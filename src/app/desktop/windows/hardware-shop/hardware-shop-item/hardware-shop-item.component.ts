import { Component, Input, OnInit } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwareShopItem } from '../hardware-shop-item';

@Component({
  selector: 'app-hardware-shop-item',
  templateUrl: './hardware-shop-item.component.html',
  styleUrls: ['./hardware-shop-item.component.scss'],
})
export class HardwareShopItemComponent implements OnInit {
  @Input() item: HardwareShopItem;

  inCart = false;

  constructor(public hardwareShopService: HardwareShopService) {
    hardwareShopService.updateCartItems.subscribe(() =>
      this.inCart = this.hardwareShopService.cartContains(this.item)
    );
  }

  ngOnInit() {
    this.inCart = this.hardwareShopService.cartContains(this.item);
  }

  addToCart(): void {
    this.hardwareShopService.addCartItem(this.item);
  }

  removeFromCart(): void {
    this.hardwareShopService.removeCartItem(this.item);
  }
}
