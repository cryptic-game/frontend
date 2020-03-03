import { EventEmitter, Injectable } from '@angular/core';
import { WebsocketService } from '../../../websocket.service';
import { WalletAppService } from '../wallet-app/wallet-app.service';
import { Category } from './category';
import { HardwarePart } from './hardware-part';

@Injectable({
  providedIn: 'root'
})
export class HardwareShopService {

  public updateCartView: EventEmitter<void> = new EventEmitter<void>();
  public updateGridView: EventEmitter<void> = new EventEmitter<void>();
  public categories: Category[];

  constructor(
    private websocketService: WebsocketService,
    private walletAppService: WalletAppService
  ) {
    this.updateHardwareParts();
  }

  public getCartItems(): HardwarePart[] {
    // TODO: Use Server Action Settings
    const items = JSON.parse(localStorage.getItem('cart'));
    return items === null ? [] : items;
  }

  public setCartItems(items: HardwarePart[]): void {
    // TODO: Use Server Action Settings
    localStorage.setItem('cart', JSON.stringify(items));
    this.updateCart();
    this.updateGridView.emit();
    this.updateCartView.emit();
  }

  public addCartItem(item: HardwarePart): void {
    const items = this.getCartItems();
    if (!this.containsInCart(item)) {
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
    items.forEach(item => item.containsInCart = this.containsInCart(item));
  }

  public containsInCart(itemName): boolean {
    let contains = false;
    this.getCartItems().forEach(element => {
      if (element.name === itemName) {
        contains = true;
      }
    });
    return contains;
  }

  public removeCartItem(item: HardwarePart): void {
    item.containsInCart = false;
    this.setCartItems(this.getCartItems().filter(function (ele) {
      return ele.name !== item.name;
    }));
  }

  /* Loading HardwareShop Items */
  public updateHardwareParts(): void {
    this.websocketService.ms('inventory', ['shop', 'list'], {})
      .subscribe(data => {
        if ('error' in data) {
          console.error('[HardwareShopService] Error while loading items:');
          console.error(data);
        } else {
          this.categories = this.loadCategories(data.categories);
          this.updateCartItems(this.getItems(this.categories));
          this.updateGridView.emit();
        }
      });
  }

  /* Buying */
  public buyCart(): void {
    let parts = '';
    this.getCartItems().forEach(part => parts += `,"${part.name}": ${part.number === undefined ? 1 : part.number}`);

    console.log(this.walletAppService.wallet);

    this.websocketService.ms('inventory', ['shop', 'buy'], {
      products: JSON.parse('{' + parts.substring(1) + '}'),
      wallet_uuid: this.walletAppService.wallet.source_uuid,
      key: this.walletAppService.wallet.key
    }).subscribe(data => {
      if (!('error' in data)) {
        this.setCartItems([]);
        this.updateCartView.emit();
      } else {
        console.error('[HardwareShopService] Error while buy items:');
        console.error(data);
      }
    });
  }

  /* Utils */
  public getItems(categories: Category[], items?: HardwarePart[]): HardwarePart[] {
    let hardwareParts = items ? items : [];
    categories.forEach(category => {
      hardwareParts = hardwareParts.concat(category.items);
      hardwareParts = this.getItems(category.categories, hardwareParts);
    });
    return hardwareParts;
  }

  public getCategory(name: string): Category {
    const categories: Category[] = [];
    this.categories.forEach(category => {
      categories.push(category);
      category.categories.forEach(subCategory => categories.push(subCategory));
    });

    for (const category of categories) {
      if (category.name === name) {
        return category;
      }
    }
    return undefined;
  }

  private loadItems(data: any): HardwarePart[] {
    const items: HardwarePart[] = [];
    Object.entries(data).forEach(([key, value]: [string, any]) => items.push({
      name: key,
      price: value.price,
      containsInCart: this.containsInCart(key),
    }));
    return items;
  }

  private loadCategories(data: any): Category[] {
    if (!data) {
      return [];
    }
    const categories: Category[] = [];
    Object.entries(data).forEach(([key, value]: [string, any]) => categories.push({
      name: key,
      items: this.loadItems(value.items),
      categories: this.loadCategories(value.categories),
      index: value.index
    }));
    categories.sort((a: Category, b: Category) => {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    });
    return categories;
  }
}
