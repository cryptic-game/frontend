import {inject, TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));
});
