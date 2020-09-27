import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopSidebarItemComponent } from './hardware-shop-sidebar-item.component';
import { HardwareShopDelegate } from '../hardware-shop.delegate';

describe('HardwareShopSidebarItemComponent', () => {
  let component: HardwareShopSidebarItemComponent;
  let fixture: ComponentFixture<HardwareShopSidebarItemComponent>;
  let shopDelegate: HardwareShopDelegate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareShopSidebarItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopSidebarItemComponent);
    component = fixture.componentInstance;
    shopDelegate = { selectedCategory: null };
    component.delegate = shopDelegate;
    component.category = { name: '', items: [], categories: [], index: 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
