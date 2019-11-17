import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hardware-shop-header',
  templateUrl: './hardware-shop-header.component.html',
  styleUrls: ['./hardware-shop-header.component.scss']
})
export class HardwareShopHeaderComponent {

  @Output()
  walletPopupOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  cartOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  cartClose: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  cardVisibility: boolean;

  @Input()
  morphCoins: number;

  @Input()
  cardItems: number;

  constructor() {
  }

  showWalletSettings(): void {
    this.walletPopupOpen.emit();
  }

  showCart() {
    this.cartOpen.emit();
  }

  hideCard() {
    this.cartClose.emit();
  }
}
