import { AccountService } from './account.service';
import { inject, TestBed } from '@angular/core/testing';
import { WebsocketService } from '../websocket.service';
import * as rxjs from 'rxjs';
import { Subject } from 'rxjs';
import { Router, RouteReuseStrategy } from '@angular/router';
import { FakePromise, webSocketMock } from '../test-utils';
import { Account } from '../../dataclasses/account';
import { WindowManagerService } from '../desktop/window-manager/window-manager.service';

describe('AccountService', () => {
  const testCredentials = { username: 'testUsername', password: 'testPassword', token: '1234567654321' };
  let webSocket;
  let windowManagerService;
  let router;
  let routeReuseStrategy;

  beforeEach(() => {
    webSocket = webSocketMock();
    windowManagerService = jasmine.createSpyObj('WindowManagerService', ['reset']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(new Promise(resolve => resolve(true)));
    routeReuseStrategy = { storedPaths: {} };

    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocket },
        { provide: WindowManagerService, useValue: windowManagerService },
        { provide: Router, useValue: router },
        { provide: RouteReuseStrategy, useValue: routeReuseStrategy }
      ]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

  it('#login() should make a login websocket request', inject([AccountService], (service: AccountService) => {
    webSocket.request.and.returnValue(rxjs.of({}));

    service.login(testCredentials.username, testCredentials.password);
    expect(webSocket.request).toHaveBeenCalledWith({
      action: 'login',
      name: testCredentials.username,
      password: testCredentials.password
    });
  }));

  it('#signUp() should make a register websocket request', inject([AccountService], (service: AccountService) => {
    webSocket.request.and.returnValue(rxjs.of({}));

    service.signUp(testCredentials.username, testCredentials.password);
    expect(webSocket.request).toHaveBeenCalledWith({
      action: 'register',
      name: testCredentials.username,
      password: testCredentials.password
    });
  }));

  it('#finalLogin() should save the token to the localStorage and navigate to / after updating of the account information',
    inject([AccountService, Router], (service: AccountService) => {
      spyOn(localStorage, 'setItem');
      const refreshAccountInfoSubject = new Subject<Account>();
      webSocket.refreshAccountInfo.and.returnValue(refreshAccountInfoSubject);
      router.navigateByUrl.and.returnValue(Promise.resolve(true));

      service.finalLogin(testCredentials.token);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', testCredentials.token);
      expect(router.navigateByUrl).not.toHaveBeenCalled();

      refreshAccountInfoSubject.next({ uuid: '', name: '', created: 0, last: 0 });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    })
  );

  it('#checkPassword() should give half a security point for each of the following that the given password contains: ' +
    'number, lowercase letter, uppercase letter, special character',
    inject([AccountService], (service: AccountService) => {
      expect(service.checkPassword('123')).toEqual(0.5);
      expect(service.checkPassword('abc')).toEqual(0.5);
      expect(service.checkPassword('ABC')).toEqual(0.5);
      expect(service.checkPassword('°!%')).toEqual(0.5);
      expect(service.checkPassword('624abc')).toEqual(1);
      expect(service.checkPassword('abcABC')).toEqual(1);
      expect(service.checkPassword('ABC=$&')).toEqual(1);
      expect(service.checkPassword('&)§947')).toEqual(1);
      expect(service.checkPassword('1aB')).toEqual(1.5);
      expect(service.checkPassword('bC&')).toEqual(1.5);
      expect(service.checkPassword('Z)8')).toEqual(1.5);
      expect(service.checkPassword('§3f')).toEqual(1.5);
      expect(service.checkPassword('7gU)')).toEqual(2);
      expect(service.checkPassword('kH§6')).toEqual(2);
      expect(service.checkPassword('L!5v')).toEqual(2);
      expect(service.checkPassword('%6vD')).toEqual(2);
    })
  );

  it('#checkPassword() should give 1 additional point if the password has at least 8 characters, ' +
    '2 if it has at least 12 and 3 if is at least 16 characters long',
    inject([AccountService], (service: AccountService) => {
      expect(service.checkPassword('aaaaaaa')).toEqual(0.5);
      expect(service.checkPassword('aaaaaaaa')).toEqual(1.5);
      expect(service.checkPassword('aaaaaaaaaaa')).toEqual(1.5);
      expect(service.checkPassword('aaaaaaaaaaaa')).toEqual(2.5);
      expect(service.checkPassword('aaaaaaaaaaaaaaa')).toEqual(2.5);
      expect(service.checkPassword('aaaaaaaaaaaaaaaa')).toEqual(3.5);
      expect(service.checkPassword('aaaaaaaaaaaaaaaaaaaaaa')).toEqual(3.5);
    })
  );

  it('#checkPassword should give at maximum 5 points for a password',
    inject([AccountService], (service: AccountService) => {
      expect(service.checkPassword('8%MPOgltIN5Z2ln&ly^F')).toEqual(5);
      expect(service.checkPassword('OOj!tx$N9sC3GY96hkKUc4!XRi^XR6c52D4jb6JI')).toEqual(5);
      expect(service.checkPassword('4Rs0vb^TsymBTXr@#KmiR8sBWZA1Tyjmj1WV94BD3AhiU!i2n5')).toEqual(5);
    })
  );

  it('#logout() should clear local storage, reset all window managers, send a logout request, navigate to /login and reset the stored routes',
    inject([AccountService], (service: AccountService) => {
      spyOn(localStorage, 'clear');
      webSocket.loggedIn = true;
      routeReuseStrategy.storedPaths = { A: 'B', C: 'D' };
      const navigateByUrlPromise = new FakePromise();
      router.navigateByUrl.and.returnValue(navigateByUrlPromise);

      service.logout();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(windowManagerService.reset).toHaveBeenCalled();

      expect(webSocket.request).toHaveBeenCalledWith({ action: 'logout' });
      expect(webSocket.loggedIn).toBeFalse();

      expect(routeReuseStrategy.storedPaths).toEqual({ A: 'B', C: 'D' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');

      navigateByUrlPromise.resolve(true);
      expect(routeReuseStrategy.storedPaths).toEqual({});
    })
  );

});
