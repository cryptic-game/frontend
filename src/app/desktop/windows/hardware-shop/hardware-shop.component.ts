import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';

import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';
import { Category } from './category';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements OnInit {

  cardVisibility: boolean;

  width: number;
  height: number;
  category: Category;
  @ViewChild('hardwareShop', { static: false })
  private hardwareShop: ElementRef;

  constructor(private hardwareShopService: HardwareShopService) {
    super();
    this.hardwareShopService.updateGridView.subscribe(() => {
      if (this.category) {
        this.category = this.hardwareShopService.getCategory(this.category.name);
      }
    });
    this.hardwareShopService.updateCartView.subscribe(() => {
      if (this.category) {
        this.category = this.hardwareShopService.getCategory(this.category.name);
      }
    });
  }

  ngOnInit(): void {
    this.cardVisibility = false;
  }

  setCardVisibility(status: boolean) {
    this.cardVisibility = status;
  }

  selectCategory(category: Category): void {
    if (this.category) {
      this.category.selected = false;
    }
    this.category = category;
    category.selected = true;
  }
}

export class HardwareShopWindowDelegate extends WindowDelegate {
  title = 'Hardware-Shop';
  icon = 'assets/desktop/img/hardware-shop.svg';
  type: Type<any> = HardwareShopComponent;

  constraints = new WindowConstraints({ minWidth: 485, minHeight: 325 });
}
