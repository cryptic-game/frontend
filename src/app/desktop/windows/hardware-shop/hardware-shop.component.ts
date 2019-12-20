import { AfterViewChecked, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';

import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements OnInit, AfterViewChecked {

  cardVisibility: boolean;

  width: number;
  height: number;

  @ViewChild('hardwareShop', { static: false })
  private hardwareShop: ElementRef;

  items: HardwarePart[];

  constructor(private hardwareShopService: HardwareShopService) {
    super();
  }

  ngOnInit(): void {
    this.cardVisibility = false;
  }

  ngAfterViewChecked(): void {
    this.width = this.hardwareShop.nativeElement.offsetWidth;
    this.height = this.hardwareShop.nativeElement.offsetHeight;
  }

  setCardVisibility(status: boolean) {
    this.cardVisibility = status;
  }

  getCartLenght(): number {
    return this.hardwareShopService.getCartItems().length;
  }
}

export class HardwareShopWindowDelegate extends WindowDelegate {
  title = 'Hardware-Shop';
  icon = 'assets/desktop/img/hardware-shop.svg';
  type: Type<any> = HardwareShopComponent;
}

export interface HardwarePart {
  name: string;
  price: number;
  category: string;
  number?: number;
  containsInCart: boolean;
}
