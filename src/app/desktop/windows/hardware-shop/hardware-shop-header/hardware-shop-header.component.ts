import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { WalletAppService } from '../../wallet-app/wallet-app.service';
import { HardwareShopService } from '../hardware-shop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hardware-shop-header',
  templateUrl: './hardware-shop-header.component.html',
  styleUrls: ['./hardware-shop-header.component.scss']
})
export class HardwareShopHeaderComponent implements OnDestroy {

  @Output() cartOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() cartClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() cartVisibility: boolean;

  cartItems: number;

  morphCoins: number;

  private subscriptions = new Subscription();

  constructor(
    private walletAppService: WalletAppService,
    private hardwareShopService: HardwareShopService
  ) {
    this.subscriptions.add(
      this.walletAppService.update.subscribe(wallet => this.morphCoins = wallet?.amount!)
    );
    this.subscriptions.add(
      this.hardwareShopService.updateCartItems.subscribe(() => this.updateCartSize())
    );
    this.walletAppService.updateWallet().then();
    this.updateCartSize();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
