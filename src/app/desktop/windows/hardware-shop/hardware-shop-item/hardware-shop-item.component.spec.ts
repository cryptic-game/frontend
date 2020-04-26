import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopItemComponent } from './hardware-shop-item.component';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('HardwareShopItemComponent', () => {
  let component: HardwareShopItemComponent;
  let fixture: ComponentFixture<HardwareShopItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [HardwareShopItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareShopItemComponent);
    component = fixture.componentInstance;
    component.item = {
      name: '',
      price: 0,
      number: 0,
      containsInCart: false
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
