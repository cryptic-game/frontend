import { inject, TestBed } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { Router } from '@angular/router';

describe('LoginGuard', () => {
  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should be created', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should navigate back to / if the user is already logged in', inject([LoginGuard, Router], (guard: LoginGuard, router: Router) => {
    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue('00000000-0000-0000-0000-000000000000');
    const allow = guard.canActivate(null, null);
    expect(getItemSpy).toHaveBeenCalledWith('token');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(allow).toBeFalsy();
  }));

  it('should allow activating if the user is not logged in', inject([LoginGuard], (guard: LoginGuard) => {
    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    const allow = guard.canActivate(null, null);
    expect(getItemSpy).toHaveBeenCalledWith('token');
    expect(allow).toBeTruthy();
  }));
});
