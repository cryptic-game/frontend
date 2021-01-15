import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwareShopCategory } from '../hardware-shop-category';
import { HardwareShopDelegate } from '../hardware-shop.delegate';

@Component({
  selector: 'app-hardware-shop-sidebar',
  templateUrl: './hardware-shop-sidebar.component.html',
  styleUrls: ['./hardware-shop-sidebar.component.scss']
})
export class HardwareShopSidebarComponent {

  @Input() delegate: HardwareShopDelegate;

  @Output() selectCategory: EventEmitter<HardwareShopCategory> = new EventEmitter<HardwareShopCategory>();

  categories: HardwareShopCategory[];

  constructor(private hardwareShopService: HardwareShopService) {
    this.load();
    this.hardwareShopService.updateCategories.subscribe(() => this.load());
  }

  private load(): void {
    this.categories = this.hardwareShopService.categories;
  }
}
