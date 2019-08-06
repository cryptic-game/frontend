import { inject, TestBed } from '@angular/core/testing';

import { SignUpService } from './sign-up.service';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketService } from '../websocket.service';

describe('SignUpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SignUpService]
    });
  });

  it('should be created', inject([SignUpService], (service: SignUpService) => {
    expect(service).toBeTruthy();
  }));

  it('#signUp() should perform a valid sign-up request',
    inject([SignUpService, WebsocketService], (service: SignUpService, webSocket: WebsocketService) => {
      const webSocketRequestSpy = spyOn(webSocket, 'request');
      const username = 'somebody';
      const password = '12345';
      const email = 'somebody@example.com';
      service.signUp(username, email, password);

      expect(webSocketRequestSpy).toHaveBeenCalledWith({
        'action': 'register',
        'name': username,
        'mail': email,
        'password': password
      });
    }));
});
