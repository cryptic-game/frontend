import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopSidebarComponent } from './hardware-shop-sidebar.component';

describe('HardwareShopSidebarComponent', () => {
  let component: HardwareShopSidebarComponent;
  let fixture: ComponentFixture<HardwareShopSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopSidebarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
