import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HardwareShopService} from '../hardware-shop.service';
import {HardwareShopCartItem} from '../hardware-shop-cart-item';

@Component({
  selector: 'app-hardware-shop-cart-item',
  templateUrl: './hardware-shop-cart-item.component.html',
  styleUrls: ['./hardware-shop-cart-item.component.scss']
})
export class HardwareShopCartItemComponent implements OnInit {

  @Input() item: HardwareShopCartItem;

  @Output() updateQuantity: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() update: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private hardwareShopService: HardwareShopService) {
  }

  ngOnInit() {
    if (this.item.quantity == null) {
      this.item.quantity = 1;
    }
    this.formGroup = this.formBuilder.group({quantity: this.item.quantity});

    this.formGroup.valueChanges.subscribe(() => {
      const field = this.formGroup.get('quantity')!;
      if (field.value < 0) {
        field.setValue(1);
      } else if (field.value > 50) {
        field.setValue(50);
      }
      this.item.quantity = field.value;
      this.updateQuantity.emit(false);
    });
  }

  remove(): void {
    this.item.quantity = undefined!;
    this.hardwareShopService.removeCartItem(this.item.shopItem);
    this.update.emit();
  }

  updateQuantityField(): void {
    const field = this.formGroup.get('quantity')!;
    field.setValue(Math.floor(field.value));
    if (field.value < 1) {
      field.setValue(1);
    } else if (field.value > 50) {
      field.setValue(50);
    }
    this.item.quantity = field.value;
    this.updateQuantity.emit(true);
  }
}
