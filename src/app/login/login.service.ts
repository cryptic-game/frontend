import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginURL = 'https://api.dev.cryptic-game.net/session/login';

  constructor(private http: HttpClient) {
  }

  login(username, password, keepLoggedIn) {
    const data = new FormData();
    data.append('username', username);
    data.append('password', password);
    if (keepLoggedIn) {
      data.append('keep', 'true');
    }

    return this.http.post(this.loginURL, data, {headers: new HttpHeaders({'enctype': 'multipart/form-data'})});
  }

}
