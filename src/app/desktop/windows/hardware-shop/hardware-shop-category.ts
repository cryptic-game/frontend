import {HardwareShopItem} from './hardware-shop-item';

export interface HardwareShopCategory {
  name: string;
  items: HardwareShopItem[];
  categories: HardwareShopCategory[];
  index: number;
}
