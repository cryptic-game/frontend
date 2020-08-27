import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletAppService } from '../../wallet-app/wallet-app.service';
import { HardwareShopService } from '../hardware-shop.service';

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

  cardItems: number;

  morphCoins: number;

  constructor(
    private walletAppService: WalletAppService,
    private hardwareShopService: HardwareShopService
  ) {
    this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet.amount);
    this.hardwareShopService.updateCartView.subscribe(() => this.loadCardSize());
    this.loadCardSize();
  }

  showCart() {
    this.cartOpen.emit();
  }

  hideCard() {
    this.cartClose.emit();
  }

  private loadCardSize(): void {
    this.cardItems = this.hardwareShopService.getCartItems().length;
  }
}
