import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {WalletAppComponent} from './wallet-app.component';
import {WalletAppHeaderComponent} from './wallet-app-header/wallet-app-header.component';
import {WalletAppTransactionComponent} from './wallet-app-transaction/wallet-app-transaction.component';
import {WebsocketService} from '../../../websocket.service';
import {webSocketMock} from '../../../test-utils';

describe('WalletAppComponent', () => {
  let component: WalletAppComponent;
  let fixture: ComponentFixture<WalletAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: WebsocketService, useValue: webSocketMock()}],
      declarations: [WalletAppComponent, WalletAppHeaderComponent, WalletAppTransactionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
