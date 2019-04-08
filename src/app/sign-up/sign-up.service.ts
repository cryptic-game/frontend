import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  constructor(private websocket: WebsocketService) {
  }

  signUp(username: string, email: string, password: string): Observable<SignUpResponse> {
    const data = {
      'action': 'register',
      'name': username,
      'mail': email,
      'password': password
    };

    return this.websocket.request(data);
  }

}

class SignUpResponse {
  error?: string;
  name?: string;
  token?: string;
}
