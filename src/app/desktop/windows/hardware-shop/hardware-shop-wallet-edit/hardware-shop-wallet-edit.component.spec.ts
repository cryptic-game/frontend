import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopWalletEditComponent } from './hardware-shop-wallet-edit.component';

describe('HardwareShopWalletEditComponent', () => {
  let component: HardwareShopWalletEditComponent;
  let fixture: ComponentFixture<HardwareShopWalletEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareShopWalletEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopWalletEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
