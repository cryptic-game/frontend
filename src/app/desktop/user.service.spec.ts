import { inject, TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketService } from '../websocket.service';
import { Router } from '@angular/router';

describe('UserService', () => {
  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        UserService,
        WebsocketService,
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('#logout() should clear storages, reconnect to the websocket and navigate back to /login',
    inject([UserService, WebsocketService, Router], (service: UserService, webSocket: WebsocketService, router: Router) => {
      const localStorageSpy = spyOn(localStorage, 'clear');
      const sessionStorageSpy = spyOn(sessionStorage, 'clear');
      const webSocketSpy = spyOn(webSocket, 'reconnect');
      service.logout('');
      expect(localStorageSpy).toHaveBeenCalled();
      expect(sessionStorageSpy).toHaveBeenCalled();
      expect(webSocketSpy).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    }));
});
