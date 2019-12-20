import { Injectable } from '@angular/core';
import { WebsocketService } from '../../../websocket.service';
import { HardwarePart } from './hardware-shop.component';
import { WalletAppService } from '../wallet-app/wallet-app.service';

@Injectable({
  providedIn: 'root'
})
export class HardwareShopService {

  constructor(
    private websocketService: WebsocketService,
    private walletAppService: WalletAppService) {
  }

  public getCartItems(): HardwarePart[] {
    const items = JSON.parse(localStorage.getItem('cart'));
    return items === null ? [] : items;
  }

  public setCartItems(items: HardwarePart[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.updateCart();
  }

  public addCartItem(item: HardwarePart): void {
    const items = this.getCartItems();
    if (!this.contains(item)) {
      item.containsInCart = true;
      items.push(item);
    }
    this.setCartItems(items);
  }

  public updateCart(): void {
    for (const item of this.getCartItems()) {
      item.containsInCart = true;
    }
  }

  public updateCartItems(items: HardwarePart[]) {
    for (const item of items) {
      item.containsInCart = this.contains(item);
    }
  }

  public contains(item: HardwarePart): boolean {
    let contains = false;
    for (const ele of this.getCartItems()) {
      if (ele.name === item.name) {
        contains = true;
      }
    }
    return contains;
  }

  public removeCartItem(item: HardwarePart): void {
    item.containsInCart = false;
    this.setCartItems(this.getCartItems().filter(function (ele) {
      return ele.name !== item.name;
    }));
  }

  public getHardwareParts(): Promise<HardwarePart[]> {
    return new Promise<HardwarePart[]>((resolve, reject) => {
      this.websocketService.ms('inventory', ['shop', 'list'], {})
        .subscribe(data => {
          if ('error' in data) {
            reject(data.error);
          } else {
            const elements = data.products;
            this.updateCartItems(elements);
            console.log(elements);
            resolve(elements);
          }
        });
    });
  }

  public buyCart(): void {
    const parts: string[] = [];
    this.getCartItems().forEach(part => parts.push(part.name));
    console.log(parts);

    console.log(JSON.stringify({
      products: parts,
      wallet_uuid: this.walletAppService.wallet.key,
      key: this.walletAppService.wallet.source_uuid
    }));

    this.websocketService.ms('inventory', ['shop', 'buy'], {
      products: parts,
      wallet_uuid: this.walletAppService.wallet.key,
      key: this.walletAppService.wallet.source_uuid
    }).subscribe(data => {
      if (!('error' in data)) {
        this.setCartItems([]);
      } else {
        console.log(data);
      }
    });
  }
}
