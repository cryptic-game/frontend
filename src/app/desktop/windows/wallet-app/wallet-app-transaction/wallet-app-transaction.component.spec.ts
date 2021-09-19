import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WalletAppTransactionComponent } from './wallet-app-transaction.component';
import { WebsocketService } from '../../../../websocket.service';
import { webSocketMock } from '../../../../test-utils';

describe('WalletAppTransactionComponent', () => {
  let component: WalletAppTransactionComponent;
  let fixture: ComponentFixture<WalletAppTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
      declarations: [WalletAppTransactionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppTransactionComponent);
    component = fixture.componentInstance;
    component.transaction = {
      destination_uuid: '',
      id: '',
      origin: 0,
      send_amount: 0,
      source_uuid: '',
      time_stamp: '',
      usage: ''
    };
    component['walletAppService'].wallet = {
      amount: 0,
      key: '',
      source_uuid: '',
      time_stamp: new Date(),
      transactions: 0,
      user_uuid: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
