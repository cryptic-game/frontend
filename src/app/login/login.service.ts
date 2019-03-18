import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://user.api.cryptic-game.net/auth';

  constructor(private http: HttpClient) {}

  login(username, password): Observable<LoginResponse> {
    const data = JSON.stringify({
      username,
      password
    });

    return this.http.post(this.url, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}

class LoginResponse {
  message?: string;
  token?: string;
}
