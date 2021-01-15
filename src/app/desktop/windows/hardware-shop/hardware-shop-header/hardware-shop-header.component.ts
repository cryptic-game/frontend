import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletAppService } from '../../wallet-app/wallet-app.service';
import { HardwareShopService } from '../hardware-shop.service';

@Component({
  selector: 'app-hardware-shop-header',
  templateUrl: './hardware-shop-header.component.html',
  styleUrls: ['./hardware-shop-header.component.scss']
})
export class HardwareShopHeaderComponent {

  @Output() cartOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() cartClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() cartVisibility: boolean;

  cartItems: number;

  morphCoins: number;

  constructor(
    private walletAppService: WalletAppService,
    private hardwareShopService: HardwareShopService
  ) {
    this.walletAppService.updateWallet().then();
    this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet.amount);
    this.hardwareShopService.updateCartItems.subscribe(() => this.updateCartSize());
    this.updateCartSize();
  }

  showCart() {
    this.cartOpen.emit();
  }

  hideCart() {
    this.cartClose.emit();
  }

  private updateCartSize(): void {
    this.cartItems = this.hardwareShopService.getCartItems().length;
  }
}
