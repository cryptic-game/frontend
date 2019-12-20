import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletAppService } from '../../wallet-app/wallet-app.service';

@Component({
  selector: 'app-hardware-shop-header',
  templateUrl: './hardware-shop-header.component.html',
  styleUrls: ['./hardware-shop-header.component.scss']
})
export class HardwareShopHeaderComponent {

  @Output()
  cartOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  cartClose: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  cardVisibility: boolean;

  @Input()
  cardItems: number;

  morphCoins: number;

  constructor(
    private walletAppService: WalletAppService
  ) {
    this.walletAppService.updateWallet();
    this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet.amount);
  }

  showCart() {
    this.cartOpen.emit();
  }

  hideCard() {
    this.cartClose.emit();
  }
}
