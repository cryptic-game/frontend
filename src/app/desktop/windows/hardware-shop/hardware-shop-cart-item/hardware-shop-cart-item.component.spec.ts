import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HardwareShopCartItemComponent } from './hardware-shop-cart-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HardwareShopService } from '../hardware-shop.service';
import { PartCategory } from '../../../../api/hardware/hardware-parts';

describe('HardwareShopCartItemComponent', () => {
  let component: HardwareShopCartItemComponent;
  let fixture: ComponentFixture<HardwareShopCartItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HardwareShopService, useValue: {} }],
      declarations: [HardwareShopCartItemComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopCartItemComponent);
    component = fixture.componentInstance;
    const testPart = { name: '', id: 0, category: PartCategory.CASE, size: 'small' };
    component.item = {
      id: 0,
      quantity: 0,
      shopItem: {
        name: '',
        price: 0,
        part: testPart,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
