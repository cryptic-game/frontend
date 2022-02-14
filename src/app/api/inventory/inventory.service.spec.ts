import {TestBed} from '@angular/core/testing';

import {InventoryService} from './inventory.service';
import * as rxjs from 'rxjs';
import {WebsocketService} from '../../websocket.service';
import {HardwareService} from '../hardware/hardware.service';
import {HardwareList} from '../hardware/hardware-list';

describe('InventoryService', () => {
  let service: InventoryService;
  let webSocket;
  let hardwareService;

  beforeEach(() => {
    webSocket = jasmine.createSpyObj('WebsocketService', ['ms']);
    webSocket.ms.and.returnValue(rxjs.of({}));
    hardwareService = jasmine.createSpyObj('HardwareService', ['getAvailableParts']);
    hardwareService.getAvailableParts.and.returnValue(rxjs.of(new HardwareList()));

    TestBed.configureTestingModule({
      providers: [
        {provide: WebsocketService, useValue: webSocket},
        {provide: HardwareService, useValue: hardwareService}
      ]
    });
    service = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
