import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  login(username, password): Observable<LoginResponse> {
    const data = {
      action: 'login',
      name: username,
      password: password
    };

    return CLIENT.request(data);
  }
}

class LoginResponse {
  error?: string;
  name?: string;
  token?: string;
}
