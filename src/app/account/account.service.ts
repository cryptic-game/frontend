import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';
import { SignUpResponse } from './interfaces/sign-up-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private websocket: WebsocketService, private router: Router) {
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.websocket.request({ action: 'login', name: username, password });
  }

  public signUp(username: string, password: string): Observable<SignUpResponse> {
    return this.websocket.request({ action: 'register', name: username, password });
  }

  public finalLogin(token: string): void {
    this.websocket.loggedIn = true;
    localStorage.setItem('token', token);
    setTimeout(() => this.router.navigateByUrl('/'), 500);
  }

  public checkPassword(password: string): number {
    let strength = 0;

    if (password.match(/[0-9]/)) {
      strength += 0.5;
    }

    if (password.match(/[a-z]/)) {
      strength += 0.5;
    }

    if (password.match(/[A-Z]/)) {
      strength += 0.5;
    }

    if (password.match(/[^\w]/)) {
      strength += 0.5;
    }

    if (password.length >= 16) {
      strength += 3;
    } else if (password.length >= 12) {
      strength += 2;
    } else if (password.length >= 8) {
      strength += 1;
    }

    return strength;
  }
}
