import {Component, Input} from '@angular/core';
import {HardwareShopCategory} from '../hardware-shop-category';

@Component({
  selector: 'app-hardware-shop-item-list',
  templateUrl: './hardware-shop-item-list.component.html',
  styleUrls: ['./hardware-shop-item-list.component.scss']
})
export class HardwareShopItemListComponent {

  @Input() category: HardwareShopCategory;
}
