import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { CLIENT } from "../websocket.service";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  signUp(username: string, email: string, password: string): Observable<SignUpResponse> {
    const data = {
      "action": "register",
      "name": username,
      "mail": email,
      "password": password
    };

    return CLIENT.request(data);
  }

}

class SignUpResponse {
  error?: string;
  name?: string;
  token?: string;
}
