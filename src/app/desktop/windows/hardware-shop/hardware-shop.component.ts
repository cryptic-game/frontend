import { AfterViewChecked, Component, ElementRef, Type, ViewChild } from '@angular/core';

import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements AfterViewChecked {

  protected walletChangePopup: boolean;
  protected cartPopup: boolean;
  protected morphCoins: number;

  protected width: number;
  protected height: number;

  @ViewChild('hardwareShop', { static: false })
  private hardwareShop: ElementRef;

  error: string;
  info: string;
  items: HardwarePart[];
  valid = true;

  wallet: string;
  walletKey: string;

  constructor(private hardwareShopService: HardwareShopService) {
    super();
    this.walletChangePopup = false;
    this.cartPopup = false;
    this.hardwareShopService.getMorphCoins()
      .then(data => this.morphCoins = data)
      .catch(() => this.morphCoins = -1);
  }

  ngAfterViewChecked(): void {
    this.width = this.hardwareShop.nativeElement.offsetWidth;
    this.height = this.hardwareShop.nativeElement.offsetHeight;
  }

  protected setWalletSettingsStatus(status: boolean) {
    this.walletChangePopup = status;
  }

  // private getParts() {
  //   this.websocketService.ms('inventory', ['shop', 'list'], {})
  //     .subscribe((data) => {
  //       if (!('error' in data)) {
  //         this.error = '';
  //         this.items = data.products;
  //       } else {
  //         this.error = this.getError(data.error);
  //         this.items = [{ name: `Error ${data.error}`, price: 0 }];
  //       }
  //     });
  // }
  //
  // buy(name: string) {
  //   console.log(JSON.stringify({ product: name, wallet_uuid: this.wallet, key: this.walletKey }));
  //   this.websocketService.ms('inventory', ['shop', 'buy'], { product: name, wallet_uuid: this.wallet, key: this.walletKey })
  //     .subscribe(data => {
  //       if (!('error' in data)) {
  //         this.info = `You bought ${name} successfully.`;
  //       } else {
  //         this.error = this.getError(data.error);
  //       }
  //     });
  // }

  private getError(error: string): string {
    switch (error) {
      case 'invalid_input_data':
        return 'The UUID ore the Key is invalid.';
      case 'wallet_not_found':
        return 'Can\'t find a Wallet with this UUID.';
      case 'permission_denied':
        return 'The key is incorrect.';
      case 'not_enough_coins':
        return 'You don\'t have enough coins.';
      default:
        return error;
    }
  }
}

export class HardwareShopWindowDelegate extends WindowDelegate {
  title = 'Hardware-Shop';
  icon = 'assets/desktop/img/hardware-shop.svg';
  type: Type<any> = HardwareShopComponent;
}

export interface HardwarePart {
  name: string;
  price: number;
}
