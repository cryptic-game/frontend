import { Component, Input, OnInit } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwareShopItem } from '../hardware-shop-item';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PartCategory } from '../../../../api/hardware/hardware-parts';

@Component({
  selector: 'app-hardware-shop-item',
  templateUrl: './hardware-shop-item.component.html',
  styleUrls: ['./hardware-shop-item.component.scss'],
  animations: [
    trigger('expandCollapse', [
      transition('void => *', [
        style({
          'opacity': '0',
          'transform': 'translateY(-100px)',
          'clip-path': 'inset(100px 0 0 0)'
        }),
        animate('200ms', style({
          'opacity': '1',
          'transform': 'translateY(0)',
          'clip-path': 'inset(0 0 0 0)'
        }))
      ]),
      transition('* => void', [
        style({
          'opacity': '1',
          'transform': 'translateY(0)',
          'clip-path': 'inset(0 0 0 0)'
        }),
        animate('200ms', style({
          'opacity': '0',
          'transform': 'translateY(-100px)',
          'clip-path': 'inset(100px 0 0 0)'
        }))
      ])
    ]),
    trigger('arrowUpwardsDownwards', [
      state('upwards', style({})),
      state('downwards', style({
        transform: 'rotateX(-180deg)'
      })),
      transition('upwards <=> downwards', [
        animate('200ms')
      ])
    ])
  ]
})
export class HardwareShopItemComponent implements OnInit {
  specifications: { [category: string]: { [property: string]: any } };
  specificationsVisible = false;

  private _item: HardwareShopItem;

  get item(): HardwareShopItem {
    return this._item;
  }

  @Input() set item(value: HardwareShopItem) {
    this._item = value;
    this.specifications = this.getSpecifications();
  }

  inCart = false;

  constructor(public hardwareShopService: HardwareShopService) {
    hardwareShopService.updateCartItems.subscribe(() =>
      this.inCart = this.hardwareShopService.cartContains(this.item)
    );
  }

  ngOnInit() {
    this.inCart = this.hardwareShopService.cartContains(this.item);
  }

  addToCart(): void {
    this.hardwareShopService.addCartItem(this.item);
  }

  removeFromCart(): void {
    this.hardwareShopService.removeCartItem(this.item);
  }

  originalOrder(): number {
    return 0;
  }

  private getSpecifications() {
    switch (this.item.part.category) {
      case PartCategory.MAINBOARD:
        // const mainboard = this.item.part as Mainboard;
        // TODO: mainboard specifications
        return {};
      case PartCategory.CPU:
        // const cpu = this.item.part as CPU;
        // TODO: CPU specifications
        return {};

      // TODO: other specifications

      default:
        return {};
    }
  }


}
