import { TestBed } from '@angular/core/testing';

import { HardwareShopService } from './hardware-shop.service';

describe('HardwareShopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HardwareShopService = TestBed.get(HardwareShopService);
    expect(service).toBeTruthy();
  });
});
