import {Component, OnDestroy} from '@angular/core';
import {HardwareShopService} from '../hardware-shop.service';
import {WalletAppService} from '../../wallet-app/wallet-app.service';
import {HardwareShopCartItem} from '../hardware-shop-cart-item';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-hardware-shop-cart',
  templateUrl: './hardware-shop-cart.component.html',
  styleUrls: ['./hardware-shop-cart.component.scss']
})
export class HardwareShopCartComponent implements OnDestroy {

  items: HardwareShopCartItem[];
  morphCoins: number;
  cartMorphCoins: string | number;
  hasEnoughMorphCoins: boolean;

  private subscriptions = new Subscription();

  constructor(private hardwareShopService: HardwareShopService,
              private walletAppService: WalletAppService) {
    this.items = this.hardwareShopService.getCartItems();
    this.cartMorphCoins = 0;
    setTimeout(() => this.cartMorphCoins = this.getTotalPrice(), 250);
    this.subscriptions.add(
      this.hardwareShopService.updateCartItems.subscribe(() => {
        this.items = this.hardwareShopService.getCartItems();
        this.cartMorphCoins = this.getTotalPrice();
      })
    );
    this.subscriptions.add(
      this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet?.amount!)
    );
    this.walletAppService.updateWallet().then();
    this.hardwareShopService.loadCartItems().then();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateNumber(save: boolean): void {
    this.hardwareShopService.setCartItems(this.items, save);
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
