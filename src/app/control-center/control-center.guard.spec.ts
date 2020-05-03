import { inject, TestBed } from '@angular/core/testing';

import { ControlCenterGuard } from './control-center.guard';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Observable, of } from 'rxjs';

describe('ControlCenterGuard', () => {

  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(new Promise(resolve => resolve(true)));
    const webSocketService = jasmine.createSpyObj('WebsocketService', ['trySession']);

    TestBed.configureTestingModule({
      providers: [
        ControlCenterGuard,
        { provide: Router, useValue: router },
        { provide: WebsocketService, useValue: webSocketService }
      ]
    });
  });

  it('should be created', inject([ControlCenterGuard], (guard: ControlCenterGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should try to login and allow activation if it succeeded',
    inject([ControlCenterGuard, WebsocketService, Router], (guard: ControlCenterGuard, webSocket: WebsocketService, router: Router) => {
      (webSocket.trySession as jasmine.Spy).and.returnValue(of(true));

      const observable = guard.canActivate(null, null) as Observable<boolean>;
      observable.subscribe(canActivate => {
        expect(webSocket.trySession).toHaveBeenCalled();
        expect(canActivate).toBeTruthy();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    })
  );

  it('should try to login and navigate back to login if it failed',
    inject([ControlCenterGuard, WebsocketService, Router], (guard: ControlCenterGuard, webSocket: WebsocketService, router: Router) => {
      (webSocket.trySession as jasmine.Spy).and.returnValue(of(false));

      const observable = guard.canActivate(null, null) as Observable<boolean>;
      observable.subscribe(canActivate => {
        expect(webSocket.trySession).toHaveBeenCalled();
        expect(canActivate).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['login']);
      });
    })
  );

});
