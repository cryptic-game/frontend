import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopCartItemComponent } from './hardware-shop-cart-item.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('HardwareShopCartItemComponent', () => {
  let component: HardwareShopCartItemComponent;
  let fixture: ComponentFixture<HardwareShopCartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
