import { TestBed } from '@angular/core/testing';

import { ControlCenterDevicePageHardwareResolverService } from './control-center-device-page-hardware-resolver.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HardwareService } from '../../api/hardware/hardware.service';
import { ControlCenterService } from '../control-center.service';

describe('ControlCenterDevicePageHardwareResolverService', () => {
  let hardwareService;
  let controlCenterService;
  let service: ControlCenterDevicePageHardwareResolverService;

  beforeEach(() => {
    hardwareService = jasmine.createSpyObj('HardwareService', ['getDeviceParts']);
    controlCenterService = jasmine.createSpyObj('ControlCenterService', ['getDevice']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: HardwareService, useValue: hardwareService },
        { provide: ControlCenterService, useValue: controlCenterService }
      ]
    });
    service = TestBed.inject(ControlCenterDevicePageHardwareResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
