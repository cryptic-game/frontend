import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HardwareShopCategory } from '../hardware-shop-category';
import { HardwareShopDelegate } from '../hardware-shop.delegate';

@Component({
  selector: 'app-hardware-shop-sidebar-item',
  templateUrl: './hardware-shop-sidebar-item.component.html',
  styleUrls: ['./hardware-shop-sidebar-item.component.scss']
})
export class HardwareShopSidebarItemComponent {

  @Input() delegate: HardwareShopDelegate;
  @Input() category: HardwareShopCategory;

  @Output() selectCategory: EventEmitter<HardwareShopCategory> = new EventEmitter<HardwareShopCategory>();

}
