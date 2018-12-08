import { TestBed, inject } from '@angular/core/testing';

import { WindowManagerService } from './window-manager.service';

describe('WindowManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowManagerService]
    });
  });

  it('should be created', inject([WindowManagerService], (service: WindowManagerService) => {
    expect(service).toBeTruthy();
  }));
});
