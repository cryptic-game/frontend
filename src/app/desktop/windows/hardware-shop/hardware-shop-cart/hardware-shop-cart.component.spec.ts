import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopCartComponent } from './hardware-shop-cart.component';

describe('HardwareShopCartComponent', () => {
  let component: HardwareShopCartComponent;
  let fixture: ComponentFixture<HardwareShopCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopCartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
