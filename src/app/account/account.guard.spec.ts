import { TestBed, async, inject } from '@angular/core/testing';

import { AccountGuard } from './account.guard';

describe('AccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountGuard]
    });
  });

  it('should ...', inject([AccountGuard], (guard: AccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
