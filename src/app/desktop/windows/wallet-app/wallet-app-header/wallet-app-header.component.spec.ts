import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WalletAppHeaderComponent } from './wallet-app-header.component';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('WalletAppHeaderComponent', () => {
  let component: WalletAppHeaderComponent;
  let fixture: ComponentFixture<WalletAppHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [WalletAppHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
