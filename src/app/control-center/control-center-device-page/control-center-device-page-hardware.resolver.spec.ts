import { TestBed } from '@angular/core/testing';

import { ControlCenterDevicePageHardwareResolver } from './control-center-device-page-hardware.resolver';
import { RouterTestingModule } from '@angular/router/testing';
import { HardwareService } from '../../api/hardware/hardware.service';

describe('ControlCenterDevicePageHardwareResolver', () => {
  let hardwareService;
  let service: ControlCenterDevicePageHardwareResolver;

  beforeEach(() => {
    hardwareService = jasmine.createSpyObj('HardwareService', ['getDeviceParts']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: HardwareService, useValue: hardwareService }],
    });
    service = TestBed.inject(ControlCenterDevicePageHardwareResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
