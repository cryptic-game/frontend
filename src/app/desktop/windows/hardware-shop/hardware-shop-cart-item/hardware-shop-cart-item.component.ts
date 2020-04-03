import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwarePart } from '../hardware-part';

@Component({
  selector: 'app-hardware-shop-cart-item',
  templateUrl: './hardware-shop-cart-item.component.html',
  styleUrls: ['./hardware-shop-cart-item.component.scss']
})
export class HardwareShopCartItemComponent implements OnInit {

  @Input()
  item: HardwarePart;

  @Output()
  updateNumber: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  update: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private hardwareShopService: HardwareShopService
  ) {
  }

  ngOnInit() {
    if (this.item.number === undefined) {
      this.item.number = 1;
    }
    this.formGroup = this.formBuilder.group({ number: this.item.number });

    this.formGroup.valueChanges.subscribe(() => {
      const field = this.formGroup.get('number');
      if (field.value < 0) {
        field.setValue(1);
      } else if (field.value > 50) {
        field.setValue(50);
      }
      this.item.number = field.value;
      this.updateNumber.emit();
    });
  }

  remove(): void {
    this.hardwareShopService.removeCartItem(this.item);
    this.update.emit();
  }

  updateField(): void {
    const field = this.formGroup.get('number');
    field.setValue(Math.floor(field.value));
    if (field.value < 1) {
      field.setValue(1);
    } else if (field.value > 50) {
      field.setValue(50);
    }
    this.item.number = field.value;
    this.updateNumber.emit();
  }
}
