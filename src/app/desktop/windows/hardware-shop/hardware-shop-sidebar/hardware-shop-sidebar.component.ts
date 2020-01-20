import { Component, EventEmitter, Output } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { Category } from '../category';

@Component({
  selector: 'app-hardware-shop-sidebar',
  templateUrl: './hardware-shop-sidebar.component.html',
  styleUrls: ['./hardware-shop-sidebar.component.scss']
})
export class HardwareShopSidebarComponent {

  categorys: Category[];

  @Output()
  private select: EventEmitter<Category> = new EventEmitter<Category>();

  constructor(
    private hardwareShopService: HardwareShopService
  ) {
    this.load();
    this.hardwareShopService.updateGridView.subscribe(() => this.load());
  }

  selectCategory(category: Category): void {
    this.select.emit(category);
  }

  private load(): void {
    this.categorys = this.hardwareShopService.categories;
  }
}
