import { Component, OnDestroy, OnInit, Type } from '@angular/core';

import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';
import { HardwareShopCategory } from './hardware-shop-category';
import { HardwareShopDelegate } from './hardware-shop.delegate';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss'],
})
export class HardwareShopComponent extends WindowComponent implements HardwareShopDelegate, OnInit, OnDestroy {
  cartVisibility = false;

  selectedCategory: HardwareShopCategory;

  private subscriptions = new Subscription();

  constructor(private hardwareShopService: HardwareShopService) {
    super();
    this.subscriptions.add(
      this.hardwareShopService.updateCategories.subscribe(() => {
        if (this.selectedCategory) {
          this.selectedCategory = this.hardwareShopService.getCategory(this.selectedCategory.name);
        }
      })
    );
    this.subscriptions.add(
      this.hardwareShopService.updateCartItems.subscribe(() => {
        if (this.selectedCategory) {
          this.selectedCategory = this.hardwareShopService.getCategory(this.selectedCategory.name);
        }
      })
    );
  }

  ngOnInit(): void {
    this.hardwareShopService.loadCartItems().then();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  override constraints = new WindowConstraints({ minWidth: 485, minHeight: 325 });
}
