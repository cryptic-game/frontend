import { Component, Input } from '@angular/core';
import { Category } from '../category';

@Component({
  selector: 'app-hardware-shop-item-grid',
  templateUrl: './hardware-shop-item-grid.component.html',
  styleUrls: ['./hardware-shop-item-grid.component.scss']
})
export class HardwareShopItemGridComponent {

  // itemWidth: number;
  //
  // @ViewChild('content', { static: false })
  // private content: ElementRef;

  @Input()
  category: Category;

  // ngAfterViewChecked(): void {
  //   this.updateItemWidth();
  // }

  // protected updateItemWidth(): void {
  //   const width = this.content.nativeElement.offsetWidth;
  //   if (width <= 400) {
  //     this.itemWidth = 100;
  //   } else if (width <= 760) {
  //     this.itemWidth = 50;
  //   } else if (width <= 1000) {
  //     this.itemWidth = 33.333;
  //   } else if (width <= 1280) {
  //     this.itemWidth = 25;
  //   } else if (width <= 1500) {
  //     this.itemWidth = 20;
  //   } else {
  //     this.itemWidth = 16.666;
  //   }
  // }
}
