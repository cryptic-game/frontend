import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {HardwareShopService} from '../hardware-shop.service';
import {HardwareShopCategory} from '../hardware-shop-category';
import {HardwareShopDelegate} from '../hardware-shop.delegate';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-hardware-shop-sidebar',
  templateUrl: './hardware-shop-sidebar.component.html',
  styleUrls: ['./hardware-shop-sidebar.component.scss']
})
export class HardwareShopSidebarComponent implements OnDestroy {

  @Input() delegate: HardwareShopDelegate;

  @Output() selectCategory: EventEmitter<HardwareShopCategory> = new EventEmitter<HardwareShopCategory>();

  categories: HardwareShopCategory[];

  private subscriptions = new Subscription();

  constructor(private hardwareShopService: HardwareShopService) {
    this.load();
    this.subscriptions.add(
      this.hardwareShopService.updateCategories.subscribe(() => this.load())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private load(): void {
    this.categories = this.hardwareShopService.categories;
  }
}
