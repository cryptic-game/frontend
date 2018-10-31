import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://user.api.cryptic-game.net/auth/';

  constructor(private http: HttpClient) {}

  login(username, password) {
    const data = JSON.stringify({
      username,
      password
    });

    return this.http.post(this.url, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
