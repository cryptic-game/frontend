import { inject, TestBed } from '@angular/core/testing';

import { SignUpGuard } from './sign-up.guard';
import { Router } from '@angular/router';

describe('SignUpGuard', () => {
  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        SignUpGuard,
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should be created', inject([SignUpGuard], (guard: SignUpGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should navigate back to / if the user is already logged in',
    inject([SignUpGuard, Router], (guard: SignUpGuard, router: Router) => {
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue('00000000-0000-0000-0000-000000000000');
      const allow = guard.canActivate(null, null);
      expect(getItemSpy).toHaveBeenCalledWith('token');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      expect(allow).toBeFalsy();
    }));

  it('should allow activating if the user is not logged in', inject([SignUpGuard], (guard: SignUpGuard) => {
    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    const allow = guard.canActivate(null, null);
    expect(getItemSpy).toHaveBeenCalledWith('token');
    expect(allow).toBeTruthy();
  }));
});
