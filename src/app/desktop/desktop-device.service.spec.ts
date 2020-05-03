import { TestBed } from '@angular/core/testing';

import { DesktopDeviceService } from './desktop-device.service';

describe('DesktopDeviceService', () => {
  let service: DesktopDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
