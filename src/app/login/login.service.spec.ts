import { inject, TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketService } from '../websocket.service';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LoginService, WebsocketService]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('#login() should perform a valid login request',
    inject([LoginService, WebsocketService], (service: LoginService, webSocket: WebsocketService) => {
      const webSocketRequestSpy = spyOn(webSocket, 'request');
      const username = 'somebody';
      const password = '12345';
      service.login(username, password);

      expect(webSocketRequestSpy).toHaveBeenCalledWith({
        action: 'login',
        name: username,
        password: password
      });
    }));
});
