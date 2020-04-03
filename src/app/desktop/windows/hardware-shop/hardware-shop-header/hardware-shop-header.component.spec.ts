import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopHeaderComponent } from './hardware-shop-header.component';

describe('HardwareShopHeaderComponent', () => {
  let component: HardwareShopHeaderComponent;
  let fixture: ComponentFixture<HardwareShopHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
