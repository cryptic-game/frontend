import { AccountGuard } from './account.guard';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AccountGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AccountGuard]
    });
  });

  it('should create', inject([AccountGuard], (guard: AccountGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should navigate to / if there already is a token in the localStorage',
    inject([AccountGuard, Router], (guard: AccountGuard, router: Router) => {
      spyOn(localStorage, 'getItem').and.returnValue('testToken');
      spyOn(router, 'navigateByUrl');

      expect(guard.canActivate(null, null)).toBeFalse();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    })
  );

  it('should allow activating if there is no token in the localStorage', inject([AccountGuard], (guard: AccountGuard) => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    expect(guard.canActivate(null, null)).toBeTruthy();
  }));

});
