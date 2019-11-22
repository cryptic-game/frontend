import { AfterViewChecked, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';

import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { HardwareShopService } from './hardware-shop.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-hardware-shop',
  templateUrl: './hardware-shop.component.html',
  styleUrls: ['./hardware-shop.component.scss']
})
export class HardwareShopComponent extends WindowComponent implements OnInit, AfterViewChecked {

  walletSettingsPopup: boolean;
  cardVisibility: boolean;
  morphCoins: number;

  width: number;
  height: number;

  @ViewChild('hardwareShop', { static: false })
  private hardwareShop: ElementRef;

  items: HardwarePart[];

  constructor(private hardwareShopService: HardwareShopService) {
    super();
  }

  ngOnInit(): void {
    this.walletSettingsPopup = false;
    this.cardVisibility = false;
    this.loadMorphCoins();

    interval(1000 * 20)
      .subscribe(this.loadMorphCoins);
  }

  ngAfterViewChecked(): void {
    this.width = this.hardwareShop.nativeElement.offsetWidth;
    this.height = this.hardwareShop.nativeElement.offsetHeight;
  }

  private loadMorphCoins(): void {
    console.log('load mc.');
    this.hardwareShopService.getMorphCoins()
      .then(data => this.morphCoins = data)
      .catch(() => this.morphCoins = -1);
  }

  setWalletSettingsStatus(status: boolean) {
    if (status === false) {
      this.loadMorphCoins();
    }
    this.walletSettingsPopup = status;
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
  number?: number;
  containsInCart: boolean;
}
