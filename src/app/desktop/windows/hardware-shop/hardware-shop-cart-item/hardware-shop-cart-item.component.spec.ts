import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopCartItemComponent } from './hardware-shop-cart-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HardwareShopService } from '../hardware-shop.service';

describe('HardwareShopCartItemComponent', () => {
  let component: HardwareShopCartItemComponent;
  let fixture: ComponentFixture<HardwareShopCartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HardwareShopService, useValue: {} }],
      declarations: [HardwareShopCartItemComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopCartItemComponent);
    component = fixture.componentInstance;
    component.item = {
      name: '',
      price: 0,
      number: 0,
      containsInCart: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
