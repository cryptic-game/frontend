import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../category';

@Component({
  selector: 'app-hardware-shop-sidebar-item',
  templateUrl: './hardware-shop-sidebar-item.component.html',
  styleUrls: ['./hardware-shop-sidebar-item.component.scss']
})
export class HardwareShopSidebarItemComponent {

  @Input()
  category: Category;

  @Output()
  private select: EventEmitter<void> = new EventEmitter<void>();

  selectItem() {
    this.select.emit();
  }
}
