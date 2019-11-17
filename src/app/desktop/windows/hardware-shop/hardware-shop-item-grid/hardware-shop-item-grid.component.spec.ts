import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopItemGridComponent } from './hardware-shop-item-grid.component';

describe('HardwareShopItemGridComponent', () => {
  let component: HardwareShopItemGridComponent;
  let fixture: ComponentFixture<HardwareShopItemGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareShopItemGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
