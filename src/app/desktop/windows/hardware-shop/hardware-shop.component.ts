import { WebsocketService } from './../../../websocket.service';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';

import { WindowComponent, WindowDelegate } from '../../window/window-delegate';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements OnInit, OnDestroy {

  error: String;
  info: String;
  items: HardwarePart[];

  wallet: String = '';
  walletKey: String = '';

  constructor(private websocketService: WebsocketService) {
    super();

    this.getParts();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  private getParts() {
    this.websocketService.ms('inventory', ['shop', 'list'], {})
      .subscribe((data) => {
        if (!('error' in data)) {
          this.error = '';
          this.items = data.products;
        } else {
          this.error = this.getError(data.error);
          this.items = [{ name: `Error ${data.error}`, price: 0 }];
        }
      });
  }

  buy(name: string) {
    console.log(JSON.stringify({ product: name, wallet_uuid: this.wallet, key: this.walletKey }));
    this.websocketService.ms('inventory', ['shop', 'buy'], { product: name, wallet_uuid: this.wallet, key: this.walletKey })
      .subscribe(data => {
        if (!('error' in data)) {
          this.info = `You bought ${name} successfully.`;
        } else {
          this.error = this.getError(data.error);
        }
      });
  }

  private getError(error: String): String {
    switch (error) {
      case 'invalid_input_data':
        return 'The UUID is invalid.';
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
  icon = 'assets/desktop/img/browser.svg';
  type: Type<any> = HardwareShopComponent;
}

export interface HardwarePart {
  name: string;
  price: number;
}
