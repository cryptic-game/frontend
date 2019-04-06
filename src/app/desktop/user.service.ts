import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CLIENT } from "../websocket.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  logout(token) {
    localStorage.clear();
    sessionStorage.clear();

    CLIENT.reconnect();

    this.router.navigate(['login']);
  }
}
