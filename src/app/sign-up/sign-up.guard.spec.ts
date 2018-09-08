import {TestBed, inject} from '@angular/core/testing';

import {SignUpGuard} from './sign-up.guard';

describe('SignUpGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignUpGuard]
    });
  });

  it('should ...', inject([SignUpGuard], (guard: SignUpGuard) => {
    expect(guard).toBeTruthy();
  }));
});
