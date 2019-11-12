import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopComponent } from './hardware-shop.component';

describe('HardwareShopComponent', () => {
  let component: HardwareShopComponent;
  let fixture: ComponentFixture<HardwareShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
