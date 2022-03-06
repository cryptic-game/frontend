import {inject, TestBed} from '@angular/core/testing';

import {HardwareShopService} from './hardware-shop.service';
import {WebsocketService} from '../../../websocket.service';
import {webSocketMock} from '../../../test-utils';

describe('HardwareShopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: WebsocketService, useValue: webSocketMock()}],
    });
  });

  it('should be created', inject([HardwareShopService], (service: HardwareShopService) => {
    expect(service).toBeTruthy();
  }));

});
