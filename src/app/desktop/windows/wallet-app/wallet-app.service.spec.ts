import { inject, TestBed } from '@angular/core/testing';

import { WalletAppService } from './wallet-app.service';
import { WebsocketService } from '../../../websocket.service';
import { webSocketMock } from '../../../test-utils';

describe('WalletAppService', () => {
  beforeEach(() => {
    jasmine.clock().install();
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
    });
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', inject([WalletAppService], (service: any) => {
    expect(service).toBeTruthy();
  }));
});
