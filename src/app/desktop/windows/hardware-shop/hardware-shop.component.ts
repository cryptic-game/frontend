import { Component, OnInit, Type } from '@angular/core';

import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';
import { HardwareShopCategory } from './hardware-shop-category';
import { HardwareShopDelegate } from './hardware-shop.delegate';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements HardwareShopDelegate, OnInit {

  cartVisibility: boolean;

  selectedCategory: HardwareShopCategory;

  constructor(private hardwareShopService: HardwareShopService) {
    super();
    this.hardwareShopService.updateCategories.subscribe(() => {
      if (this.selectedCategory) {
        this.selectedCategory = this.hardwareShopService.getCategory(this.selectedCategory.name);
      }
    });
    this.hardwareShopService.updateCartItems.subscribe(() => {
      if (this.selectedCategory) {
        this.selectedCategory = this.hardwareShopService.getCategory(this.selectedCategory.name);
      }
    });
  }

  ngOnInit(): void {
    this.cartVisibility = false;
  }

  setCartVisibility(status: boolean) {
    this.cartVisibility = status;
  }

  selectCategory(category: HardwareShopCategory): void {
    this.selectedCategory = category;
  }
}

export class HardwareShopWindowDelegate extends WindowDelegate {
  title = 'Hardware-Shop';
  icon = 'assets/desktop/img/hardware-shop.svg';
  type: Type<any> = HardwareShopComponent;

  constraints = new WindowConstraints({ minWidth: 485, minHeight: 325 });
}
