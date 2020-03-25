import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopCartItemComponent } from './hardware-shop-cart-item.component';

describe('HardwareShopCartItemComponent', () => {
  let component: HardwareShopCartItemComponent;
  let fixture: ComponentFixture<HardwareShopCartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopCartItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
