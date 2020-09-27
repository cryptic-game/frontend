import { Component } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { WalletAppService } from '../../wallet-app/wallet-app.service';
import { HardwareShopCartItem } from '../hardware-shop-cart-item';

@Component({
  selector: 'app-hardware-shop-cart',
  templateUrl: './hardware-shop-cart.component.html',
  styleUrls: ['./hardware-shop-cart.component.scss']
})
export class HardwareShopCartComponent {

  items: HardwareShopCartItem[];
  morphCoins: number;
  cartMorphCoins: string | number;
  hasEnoughMorphCoins: boolean;

  constructor(
    private hardwareShopService: HardwareShopService,
    private walletAppService: WalletAppService
  ) {
    this.items = this.hardwareShopService.getCartItems();
    this.cartMorphCoins = 'Loading...';
    setTimeout(() => this.cartMorphCoins = this.getTotalPrice(), 250);
    this.hardwareShopService.updateCartItems.subscribe(() => {
      this.items = this.hardwareShopService.getCartItems();
      this.cartMorphCoins = this.getTotalPrice();
    });
    this.walletAppService.updateWallet().then();
    this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet.amount);
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

  private getTotalPrice(): number {
    const mc = this.items.reduce((acc, item) => acc + (item.shopItem.price * item.quantity), 0);
    this.hasEnoughMorphCoins = this.morphCoins >= mc && mc !== 0;
    return mc / 1000;
  }
}
