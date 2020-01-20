import { HardwarePart } from './hardware-part';

export interface Category {
  name: string;
  items: HardwarePart[];
  categories: Category[];
}
