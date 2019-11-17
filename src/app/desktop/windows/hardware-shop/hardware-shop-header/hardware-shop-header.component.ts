import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hardware-shop-header',
  templateUrl: './hardware-shop-header.component.html',
  styleUrls: ['./hardware-shop-header.component.scss']
})
export class HardwareShopHeaderComponent {

  @Output()
  protected walletPopupOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  protected cartOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  protected cartClose: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  protected cardVisibility: boolean;

  @Input()
  protected morphCoins: number;

  @Input()
  protected cardItems: number;

  constructor() {
  }

  protected showWalletSettings(): void {
    this.walletPopupOpen.emit();
  }

  protected showCart() {
    this.cartOpen.emit();
  }

  protected hideCard() {
    this.cartClose.emit();
  }
}
