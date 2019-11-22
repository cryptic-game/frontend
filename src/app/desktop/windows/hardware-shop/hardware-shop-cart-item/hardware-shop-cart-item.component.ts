import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HardwarePart } from '../hardware-shop.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HardwareShopService } from '../hardware-shop.service';

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
  }

  remove(): void {
    this.hardwareShopService.removeCartItem(this.item);
    this.update.emit();
  }

  updateField(): void {
    const field = this.formGroup.get('number');
    field.setValue(field.value);
    if (field.value < 1) {
      field.setValue(1);
    }
    this.item.number = field.value;
    this.updateNumber.emit();
  }
}
