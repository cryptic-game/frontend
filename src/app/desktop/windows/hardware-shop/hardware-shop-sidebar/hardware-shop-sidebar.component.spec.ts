import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HardwareShopSidebarComponent } from './hardware-shop-sidebar.component';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('HardwareShopSidebarComponent', () => {
  let component: HardwareShopSidebarComponent;
  let fixture: ComponentFixture<HardwareShopSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [HardwareShopSidebarComponent]
    }).compileComponents();
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
