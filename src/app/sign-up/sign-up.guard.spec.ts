import { inject, TestBed } from '@angular/core/testing';

import { SignUpGuard } from './sign-up.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignUpGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [SignUpGuard]
    });
  });

  it('should ...', inject([SignUpGuard], (guard: SignUpGuard) => {
    expect(guard).toBeTruthy();
  }));
});
