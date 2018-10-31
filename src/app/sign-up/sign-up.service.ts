import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  url = 'https://user.api.cryptic-game.net/';

  constructor(private http: HttpClient) {}

  signUp(username: string, email: string, password: string) {
    const data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('password', password);

    return this.http.put(this.url, data, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' })
    });
  }
}
