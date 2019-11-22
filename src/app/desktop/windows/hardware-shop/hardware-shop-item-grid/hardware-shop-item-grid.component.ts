import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HardwarePart } from '../hardware-shop.component';
import { HardwareShopService } from '../hardware-shop.service';

@Component({
  selector: 'app-hardware-shop-item-grid',
  templateUrl: './hardware-shop-item-grid.component.html',
  styleUrls: ['./hardware-shop-item-grid.component.scss']
})
export class HardwareShopItemGridComponent implements OnInit, AfterViewChecked {

  items: HardwarePart[];
  itemWidth: number;

  @ViewChild('content', { static: false })
  private content: ElementRef;

  constructor(
    private hardwareShopService: HardwareShopService
  ) {
    this.items = [];
  }

  ngOnInit(): void {
    this.hardwareShopService.getHardwareParts()
      .then(data => this.items = data)
      .catch(() => this.items = []);
  }

  ngAfterViewChecked(): void {
    this.updateItemWidth();
  }

  protected updateItemWidth(): void {
    const width = this.content.nativeElement.offsetWidth;
    if (width <= 400) {
      this.itemWidth = 100;
    } else if (width <= 760) {
      this.itemWidth = 50;
    } else if (width <= 1000) {
      this.itemWidth = 33.333;
    } else if (width <= 1280) {
      this.itemWidth = 25;
    } else if (width <= 1500) {
      this.itemWidth = 20;
    } else {
      this.itemWidth = 16.666;
    }
  }
}
