import { inject, TestBed } from '@angular/core/testing';

import { WalletAppService } from './wallet-app.service';
import { WebsocketService } from '../../../websocket.service';
import { webSocketMock } from '../../../test-utils';

describe('WalletAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: WebsocketService, useValue: webSocketMock() }]
  }));

  it('should be created', inject([WalletAppService], (service) => {
    expect(service).toBeTruthy();
  }));
});
