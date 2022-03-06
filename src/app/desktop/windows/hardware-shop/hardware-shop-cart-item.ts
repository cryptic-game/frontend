import {HardwareShopItem} from './hardware-shop-item';

export interface HardwareShopCartItem {
  id: number;
  quantity: number;
  shopItem: HardwareShopItem;
}
