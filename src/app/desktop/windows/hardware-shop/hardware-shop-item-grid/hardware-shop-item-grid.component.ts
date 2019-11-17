import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HardwarePart } from '../hardware-shop.component';

@Component({
  selector: 'app-hardware-shop-item-grid',
  templateUrl: './hardware-shop-item-grid.component.html',
  styleUrls: ['./hardware-shop-item-grid.component.scss']
})
export class HardwareShopItemGridComponent implements AfterViewChecked {

  @Input() items: HardwarePart[];
  protected itemWidth: number;

  @ViewChild('content', { static: false })
  private content: ElementRef;

  constructor() {
    this.items = [];
  }

  ngAfterViewChecked(): void {
    this.updateItemWidth();
  }

  protected updateItemWidth(): void {
    const width = this.content.nativeElement.offsetWidth;
    if (width <= 400) {
      this.itemWidth = 100;
    } else if (width <= 560) {
      this.itemWidth = 50;
    } else if (width <= 750) {
      this.itemWidth = 33.333;
    } else if (width <= 1000) {
      this.itemWidth = 25;
    } else if (width <= 1200) {
      this.itemWidth = 20;
    } else {
      this.itemWidth = 16.666;
    }
  }
}
