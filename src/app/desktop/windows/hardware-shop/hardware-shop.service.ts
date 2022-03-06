import {EventEmitter, Injectable} from '@angular/core';
import {WebsocketService} from '../../../websocket.service';
import {WalletAppService} from '../wallet-app/wallet-app.service';
import {HardwareShopCategory} from './hardware-shop-category';
import {HardwareShopItem} from './hardware-shop-item';
import {HardwareService} from '../../../api/hardware/hardware.service';
import {HardwareShopCartItem} from './hardware-shop-cart-item';
import {EMPTY, Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SettingService} from '../../../api/setting/setting.service';

@Injectable({
  providedIn: 'root'
})
export class HardwareShopService {

  public updateCartItems: EventEmitter<void> = new EventEmitter<void>();
  public updateCategories: EventEmitter<void> = new EventEmitter<void>();
  public categories: HardwareShopCategory[];

  private cartItems: HardwareShopCartItem[] = [];

  constructor(
    private websocketService: WebsocketService,
    private walletAppService: WalletAppService,
    private hardwareService: HardwareService,
    private settingService: SettingService
  ) {
    hardwareService.getAvailableParts().pipe(
      switchMap(() => this.updateHardwareParts())
    ).subscribe(() => {
      this.loadCartItems().then();
    });
  }

  async loadCartItems(): Promise<void> {
    if (this.categories == null) {
      return;
    }
    const items = this.getItems(this.categories);
    let storedCart: { [id: number]: number } = {};
    try {
      storedCart = JSON.parse((await this.settingService.get('shop_cart').toPromise())!) ?? {};
    } catch (e) {
      // @ts-ignore
      if (e.message !== 'unknown setting') {
        console.warn(e);
      }
    }

    this.cartItems = items.filter(item => storedCart.hasOwnProperty(item.part.id)).map(shopItem => ({
      id: shopItem.part.id,
      quantity: storedCart[shopItem.part.id],
      shopItem: shopItem
    }));
    this.updateCartItems.emit();
  }

  getCartItems(): HardwareShopCartItem[] {
    return this.cartItems;
  }

  setCartItems(items: HardwareShopCartItem[], save = true): void {
    this.cartItems = items;
    if (save) {
      this.settingService.set('shop_cart', JSON.stringify(
        items.reduce((acc, item) => ({...acc, [item.id]: item.quantity}), {}))
      );
    }

    this.updateCartItems.emit();
  }

  cartContains(item: HardwareShopItem): boolean {
    return this.cartItems.some(cartItem => cartItem.id === item.part.id);
  }

  addCartItem(item: HardwareShopItem): void {
    const items = this.getCartItems();
    if (!this.cartContains(item)) {
      items.push({id: item.part.id, quantity: 1, shopItem: item});
    }
    this.setCartItems(items);
  }

  removeCartItem(item: HardwareShopItem): void {
    this.setCartItems(this.cartItems.filter((ele: HardwareShopCartItem) => ele.id !== item.part.id));
  }

  updateHardwareParts(): Observable<void> {
    return this.websocketService.ms('inventory', ['shop', 'list'], {}).pipe(map(data => {
      this.categories = this.loadCategories(data.categories);
      this.updateCategories.emit();
    }), catchError(error => {
      console.error('[HardwareShopService] Error while loading items: ' + error.message);
      return EMPTY;
    }));
  }

  buyCart(): void {
    this.websocketService.ms('inventory', ['shop', 'buy'], {
      products: this.getCartItems().reduce((acc, item) => ({...acc, [item.shopItem.name]: item.quantity}), {}),
      wallet_uuid: this.walletAppService.wallet!.source_uuid,
      key: this.walletAppService.wallet!.key
    }).subscribe({
      next: () => {
        this.cartItems.forEach(item => item.quantity = undefined!);
        this.setCartItems([]);
      },
      error: (error: Error) => console.error('[HardwareShopService] Error while buying items: ' + error.message)
    });
  }

  getItems(categories: HardwareShopCategory[], items?: HardwareShopItem[]): HardwareShopItem[] {
    let hardwareParts = items ?? [];
    for (const category of categories) {
      hardwareParts = hardwareParts.concat(category.items);
      hardwareParts = this.getItems(category.categories, hardwareParts);
    }
    return hardwareParts;
  }

  getCategory(name: string, parents?: HardwareShopCategory[]): HardwareShopCategory {
    if (parents == null) {
      const result = this.categories.find(category => category.name === name);
      if (result) {
        return result;
      }

      parents = this.categories;
    }

    const children: HardwareShopCategory[] = [];
    for (const parent of parents) {
      const result = parent.categories.find(category => category.name === name);
      if (result) {
        return result;
      }

      children.push(...parents);
    }

    if (children.length > 0) {
      return this.getCategory(name, children);
    }

    return null!;
  }

  private loadItems(data: any): HardwareShopItem[] {
    return Object.entries(data).map(([key, value]: [string, any]) => ({
      name: key,
      part: this.hardwareService.hardwareAvailable!.getByName(key),
      price: value.price
    }));
  }

  private loadCategories(data: any): HardwareShopCategory[] {
    if (!data) {
      return [];
    }
    const categories: HardwareShopCategory[] = Object.entries(data).map(([key, value]: [string, any]) => ({
      name: key,
      items: this.loadItems(value.items),
      categories: this.loadCategories(value.categories),
      index: value.index
    }));
    categories.sort((a, b) => a.index - b.index);
    return categories;
  }
}
