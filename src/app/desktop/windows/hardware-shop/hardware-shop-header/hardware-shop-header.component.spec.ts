import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareShopHeaderComponent } from './hardware-shop-header.component';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('HardwareShopHeaderComponent', () => {
  let component: HardwareShopHeaderComponent;
  let fixture: ComponentFixture<HardwareShopHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
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
