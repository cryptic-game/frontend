import { Component, Input } from '@angular/core';
import { Category } from '../category';

@Component({
  selector: 'app-hardware-shop-item-list',
  templateUrl: './hardware-shop-item-list.component.html',
  styleUrls: ['./hardware-shop-item-list.component.scss']
})
export class HardwareShopItemListComponent {

  @Input()
  category: Category;
}
