import { AccountGuard } from './account.guard';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Observable, of } from 'rxjs';

describe('AccountGuard', () => {
  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(new Promise((resolve) => resolve(true)));
    const webSocketService = jasmine.createSpyObj('WebsocketService', ['trySession']);

    TestBed.configureTestingModule({
      providers: [
        AccountGuard,
        { provide: Router, useValue: router },
        { provide: WebsocketService, useValue: webSocketService },
      ],
    });
  });

  it('should create', inject([AccountGuard], (guard: AccountGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should try to login and navigate back to / if it succeeded', inject(
    [AccountGuard, WebsocketService, Router],
    (guard: AccountGuard, webSocket: WebsocketService, router: Router) => {
      (webSocket.trySession as jasmine.Spy).and.returnValue(of(true));
      (router.navigate as jasmine.Spy).and.returnValue(new Promise(() => {}));

      const observable = guard.canActivate(null!, null!) as Observable<boolean>;
      observable.subscribe((canActivate) => {
        expect(webSocket.trySession).toHaveBeenCalled();
        expect(canActivate).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith([]);
      });
    }
  ));

  it('should try to login and allow activation if it failed', inject(
    [AccountGuard, WebsocketService, Router],
    (guard: AccountGuard, webSocket: WebsocketService, router: Router) => {
      (webSocket.trySession as jasmine.Spy).and.returnValue(of(false));
      (router.navigate as jasmine.Spy).and.returnValue(new Promise(() => {}));

      const observable = guard.canActivate(null!, null!) as Observable<boolean>;
      observable.subscribe((canActivate) => {
        expect(webSocket.trySession).toHaveBeenCalled();
        expect(canActivate).toBeTruthy();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    }
  ));
});
