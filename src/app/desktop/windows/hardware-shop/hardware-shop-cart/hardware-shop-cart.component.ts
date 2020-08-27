import { Component } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwarePart } from '../hardware-part';
import { WalletAppService } from '../../wallet-app/wallet-app.service';

@Component({
  selector: 'app-hardware-shop-cart',
  templateUrl: './hardware-shop-cart.component.html',
  styleUrls: ['./hardware-shop-cart.component.scss']
})
export class HardwareShopCartComponent {

  items: HardwarePart[];
  morphCoins: number;
  cardMorphCoins: string | number;
  hasEnoughMorphCoins: boolean;

  constructor(
    private hardwareShopService: HardwareShopService,
    private walletAppService: WalletAppService
  ) {
    this.items = this.hardwareShopService.getCartItems();
    this.cardMorphCoins = 'Loading...';
    setTimeout(() => this.cardMorphCoins = this.getHoleMorphCoins(), 2000);
    this.hardwareShopService.updateCartView.subscribe(() => {
      this.items = this.hardwareShopService.getCartItems();
      this.cardMorphCoins = this.getHoleMorphCoins();
    });
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

  private getHoleMorphCoins(): number {
    let mc = 0;
    this.items.forEach(item => mc += item.price * item.number);
    this.hasEnoughMorphCoins = this.morphCoins >= mc && mc !== 0;
    return mc / 1000;
  }
}
