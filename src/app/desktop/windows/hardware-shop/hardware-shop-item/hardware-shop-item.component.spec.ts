import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopItemComponent } from './hardware-shop-item.component';

describe('HardwareShopItemComponent', () => {
  let component: HardwareShopItemComponent;
  let fixture: ComponentFixture<HardwareShopItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
