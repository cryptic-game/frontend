import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopComponent } from './hardware-shop.component';
import { HardwareShopHeaderComponent } from './hardware-shop-header/hardware-shop-header.component';
import { HardwareShopSidebarComponent } from './hardware-shop-sidebar/hardware-shop-sidebar.component';
import { HardwareShopItemListComponent } from './hardware-shop-item-list/hardware-shop-item-list.component';
import { HardwareShopCartComponent } from './hardware-shop-cart/hardware-shop-cart.component';
import { WebsocketService } from '../../../websocket.service';
import { webSocketMock } from '../../../test-utils';

describe('HardwareShopComponent', () => {
  let component: HardwareShopComponent;
  let fixture: ComponentFixture<HardwareShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [
        HardwareShopComponent,
        HardwareShopHeaderComponent,
        HardwareShopSidebarComponent,
        HardwareShopItemListComponent,
        HardwareShopCartComponent
      ]
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

