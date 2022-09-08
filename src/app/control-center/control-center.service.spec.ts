import { TestBed } from '@angular/core/testing';

import { ControlCenterService } from './control-center.service';
import { DeviceService } from '../api/devices/device.service';

describe('ControlCenterService', () => {
  let deviceService;
  let service: ControlCenterService;

  beforeEach(() => {
    deviceService = jasmine.createSpyObj('DeviceService', ['getDevices']);
    TestBed.configureTestingModule({
      providers: [{ provide: DeviceService, useValue: deviceService }],
    });
    service = TestBed.inject(ControlCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
