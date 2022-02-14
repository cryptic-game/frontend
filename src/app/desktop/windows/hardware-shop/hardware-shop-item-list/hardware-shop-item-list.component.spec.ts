import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HardwareShopItemListComponent} from './hardware-shop-item-list.component';

describe('HardwareShopItemGridComponent', () => {
  let component: HardwareShopItemListComponent;
  let fixture: ComponentFixture<HardwareShopItemListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopItemListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
