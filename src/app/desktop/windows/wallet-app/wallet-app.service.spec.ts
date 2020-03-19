import { TestBed } from '@angular/core/testing';

import { WalletAppService } from './wallet-app.service';

describe('WalletAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalletAppService = TestBed.get(WalletAppService);
    expect(service).toBeTruthy();
  });
});
