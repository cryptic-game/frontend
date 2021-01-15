import { TestBed } from '@angular/core/testing';

import { VersionService } from './version.service';
import { SwUpdate } from '@angular/service-worker';
import { swUpdateMock } from './test-utils';

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: swUpdateMock() }
      ]
    });
    service = TestBed.inject(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
