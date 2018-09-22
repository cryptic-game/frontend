import { OwnerBackend } from './../../dataclasses/accountbackend.class';
import { SessionBackend } from './../../dataclasses/sessionbackend.class';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  url = 'https://api.dev.cryptic-game.net';

  logout(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    this.http
      .post(`${this.url}/session/logout`, null, httpOptions)
      .subscribe(data => console.log(data));

    sessionStorage.removeItem('token');
    localStorage.removeItem('token');

    this.router.navigate(['login']);
  }

  list(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post<SessionBackend[]>(
      `${this.url}/session/list`,
      null,
      httpOptions
    );
  }

  owner(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post<OwnerBackend>(
      `${this.url}/session/owner`,
      null,
      httpOptions
    );
  }
}
