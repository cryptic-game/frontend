import { inject, TestBed } from '@angular/core/testing';

import { DesktopGuard } from './desktop.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Observable, of, throwError } from 'rxjs';

describe('DesktopGuard', () => {
  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(new Promise(resolve => resolve(true)));
    const webSocketService = jasmine.createSpyObj('WebsocketService', ['request']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DesktopGuard,
        { provide: Router, useValue: router },
        { provide: WebsocketService, useValue: webSocketService }
      ]
    });
  });

  it('should be created', inject([DesktopGuard], (guard: DesktopGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should navigate back to login when the user is not logged in',
    inject([DesktopGuard, Router], (guard: DesktopGuard, router: Router) => {
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(guard.canActivate(null, null)).toBeFalsy();
      expect(getItemSpy).toHaveBeenCalledWith('token');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    }));

  it('should allow activating if the websocket is already logged in',
    inject([DesktopGuard, WebsocketService], (guard: DesktopGuard, webSocket: WebsocketService) => {
      const testToken = '00000000-0000-0000-0000-000000000000';
      spyOn(localStorage, 'getItem').and.returnValue(testToken);
      (webSocket.request as jasmine.Spy).and.returnValue(of({}));
      const result = guard.canActivate(null, null) as Observable<boolean>;
      result.subscribe(allow => {
        expect(allow).toBeTruthy();
      });
      expect(webSocket.request).toHaveBeenCalledWith({ action: 'info' });
    }));

  it('should try to login if the token entry in the localstorage is set and the websocket is not logged in already',
    inject([DesktopGuard, WebsocketService], (guard: DesktopGuard, webSocket: WebsocketService) => {
      const testToken = '00000000-0000-0000-0000-000000000000';
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(testToken);
      (webSocket.request as jasmine.Spy).and.returnValues(throwError(new Error('unknown action')), of({ token: testToken }));

      const result = guard.canActivate(null, null) as Observable<boolean>;
      result.subscribe(allow => {
        expect(allow).toBeTruthy();
      });
      expect(getItemSpy).toHaveBeenCalledWith('token');
      expect(webSocket.request).toHaveBeenCalledWith({ action: 'session', token: testToken });
    }));

  it('should remove the current token and navigate back to the login page if the login with the token failed',
    inject([DesktopGuard, WebsocketService, Router], (guard: DesktopGuard, webSocket: WebsocketService, router: Router) => {
      const testToken = '00000000-0000-0000-0000-000000000000';
      spyOn(localStorage, 'getItem').and.returnValue(testToken);
      (webSocket.request as jasmine.Spy).and.returnValues(throwError(new Error('unknown action')), throwError(new Error('invalid_credentials')));

      const result = guard.canActivate(null, null) as Observable<boolean>;
      result.subscribe(allow => {
        expect(allow).toBeFalsy();
      });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    }));

});
