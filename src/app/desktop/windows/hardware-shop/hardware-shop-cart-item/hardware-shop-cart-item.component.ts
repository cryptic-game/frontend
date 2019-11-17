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
  protected item: HardwarePart;

  @Output()
  protected updateNumber: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  protected update: EventEmitter<any> = new EventEmitter<any>();

  protected formGroup: FormGroup;

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
    this.formGroup.valueChanges.subscribe(data => {
      if (data.number < 0) {
        this.item.number = 0;
        this.formGroup.get('number').setValue(0);
        this.updateNumber.emit();
      } else {
        this.item.number = data.number;
        this.updateNumber.emit();
      }
    });
  }

  protected remove(): void {
    this.hardwareShopService.removeCartItem(this.item);
    this.update.emit();
  }
}
