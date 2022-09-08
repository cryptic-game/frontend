import { TestBed } from '@angular/core/testing';

import { DesktopGuard } from './desktop.guard';
import { WebsocketService } from '../websocket.service';
import { Observable, of } from 'rxjs';
import { webSocketMock } from '../test-utils';
import { Router } from '@angular/router';

describe('DesktopGuard', () => {
  //TODO: Type me correct
  let webSocketService: any;
  let router: any;
  let guard: DesktopGuard;

  beforeEach(() => {
    webSocketService = webSocketMock();
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(new Promise((resolve) => resolve(true)));

    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocketService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(DesktopGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should try to login and allow activation if it succeeded', () => {
    webSocketService.trySession.and.returnValue(of(true));

    const observable = guard.canActivate(null, null) as Observable<boolean>;
    expect(observable).toBeInstanceOf(Observable);

    observable.subscribe({
      next: (canActivate: boolean) => {
        expect(webSocketService.trySession).toHaveBeenCalled();
        expect(canActivate).toBeTrue();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      },
      error: () => fail,
    });
  });

  it('should try to login and navigate back to login if it failed', () => {
    webSocketService.trySession.and.returnValue(of(false));

    const observable = guard.canActivate(null, null) as Observable<boolean>;
    expect(observable).toBeInstanceOf(Observable);

    observable.subscribe({
      next: (canActivate: boolean) => {
        expect(webSocketService.trySession).toHaveBeenCalled();
        expect(canActivate).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      },
      error: () => fail,
    });
  });
});
