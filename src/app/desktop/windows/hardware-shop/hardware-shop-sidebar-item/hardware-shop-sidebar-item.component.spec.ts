import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopSidebarItemComponent } from './hardware-shop-sidebar-item.component';

describe('HardwareShopSidebarItemComponent', () => {
  let component: HardwareShopSidebarItemComponent;
  let fixture: ComponentFixture<HardwareShopSidebarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopSidebarItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopSidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
