import { inject, TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { of, throwError } from 'rxjs';

describe('WebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketService]
    });

    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should be created', inject([WebsocketService], (service: WebsocketService) => {
    expect(service).toBeTruthy();
  }));

  it('#logout() should clear local and session storage and send a log out request',
    inject([WebsocketService], (service: WebsocketService) => {
      spyOn(localStorage, 'clear');
      spyOn(sessionStorage, 'clear');
      spyOn(service, 'request');

      service.logout();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(service.request).toHaveBeenCalledWith({ action: 'logout' });
    })
  );

  it('#refreshAccountInfo() should get information about the account, save it and return it',
    inject([WebsocketService], (service: WebsocketService) => {
      const testAccount = {
        uuid: '7deb783d-59d6-4ed1-90e9-47898051e31d',
        name: 'test-user',
        mail: 'user@test.com',
        created: 262476,
        last: 124215
      };
      const infoResponse = { ...testAccount, online: 15 };
      spyOn(service, 'request').and.returnValue(of(infoResponse));

      service.refreshAccountInfo().subscribe(account => {
        expect(service.account).toEqual(testAccount);
        expect(service.onlinePlayers).toEqual(infoResponse.online);
        expect(account).toEqual(testAccount);
      });
    })
  );

  it('#trySession() should return true if the user is already logged in',
    inject([WebsocketService], (service: WebsocketService) => {
      spyOn(service, 'request');
      service.loggedIn = true;

      service.trySession().subscribe(success => {
        expect(service.request).not.toHaveBeenCalled();
        expect(success).toBeTrue();
      });
    })
  );

  it('#trySession() should return false if the user is not logged in and there is no token in the localstorage',
    inject([WebsocketService], (service: WebsocketService) => {
      spyOn(service, 'request');
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      service.loggedIn = false;

      service.trySession().subscribe(success => {
        expect(service.request).not.toHaveBeenCalled();
        expect(localStorage.getItem).toHaveBeenCalledWith('token');
        expect(success).toBeFalse();
        expect(service.loggedIn).toBeFalse();
      });
    })
  );

  it('#trySession() should refresh the account information and return true if the authentication using the token in the localstorage succeeded',
    inject([WebsocketService], (service: WebsocketService) => {
      const testToken = 'ca3657dc-b69c-45cb-97c9-9d863a5e93f4';
      spyOn(service, 'request').and.returnValue(of({ token: testToken }));
      spyOn(service, 'refreshAccountInfo').and.returnValue(of({} as any));
      (localStorage.getItem as jasmine.Spy).and.returnValue(testToken);
      service.loggedIn = false;

      service.trySession().subscribe(success => {
        expect(service.request).toHaveBeenCalledWith({ action: 'session', token: testToken });
        expect(service.refreshAccountInfo).toHaveBeenCalled();
        expect(localStorage.getItem).toHaveBeenCalledWith('token');
        expect(success).toBeTrue();
        expect(service.loggedIn).toBeTrue();
      });
    })
  );

  it('#trySession() should remove the token from the localstorage if the authentication failed',
    inject([WebsocketService], (service: WebsocketService) => {
      const testToken = '3c0f0c90-dd6f-4c0c-bc77-639586e07cd9';
      spyOn(service, 'request').and.returnValue(throwError(new Error('invalid token')));
      spyOn(service, 'refreshAccountInfo').and.returnValue(of({} as any));
      (localStorage.getItem as jasmine.Spy).and.returnValue(testToken);
      service.loggedIn = false;

      service.trySession().subscribe(success => {
        expect(service.request).toHaveBeenCalledWith({ action: 'session', token: testToken });
        expect(service.refreshAccountInfo).not.toHaveBeenCalled();
        expect(localStorage.getItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(success).toBeFalse();
        expect(service.loggedIn).toBeFalse();
      });
    })
  );

});
