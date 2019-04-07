import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private websocket: WebsocketService) {
  }

  login(username, password): Observable<LoginResponse> {
    const data = {
      action: 'login',
      name: username,
      password: password
    };

    return this.websocket.request(data);
  }
}

class LoginResponse {
  error?: string;
  name?: string;
  token?: string;
}
