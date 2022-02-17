import {Part} from '../../../api/hardware/hardware-parts';

export interface HardwareShopItem {
  name: string;
  price: number;
  part: Part;
}
