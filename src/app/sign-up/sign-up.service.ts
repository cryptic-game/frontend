import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  url = 'https://user.api.cryptic-game.net/auth';

  constructor(private http: HttpClient) {}

  signUp(username: string, email: string, password: string) {
    const data = JSON.stringify({
      username,
      email,
      password
    });

    return this.http.put(this.url, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
