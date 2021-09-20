import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';
import { SignUpResponse } from './interfaces/sign-up-response';
import { Router, RouteReuseStrategy } from '@angular/router';
import { WindowManagerService } from '../desktop/window-manager/window-manager.service';
import { AppRouteReuseStrategy } from '../app-route-reuse-strategy';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private websocket: WebsocketService,
              private router: Router,
              private routeReuseStrategy: RouteReuseStrategy,
              private windowManagerService: WindowManagerService) {
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.websocket.request({ action: 'login', name: username, password: password });
  }

  signUp(username: string, password: string): Observable<SignUpResponse> {
    return this.websocket.request({ action: 'register', name: username, password: password });
  }

  finalLogin(token: string, redirect: string): void {
    this.websocket.loggedIn = true;
    localStorage.setItem('token', token);
    this.websocket.refreshAccountInfo().subscribe(() => {
      this.router.navigateByUrl(redirect).then();
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.websocket.request({ action: 'password', password: oldPassword, new: newPassword }).pipe(
      flatMap(({ token }) => {
        localStorage.setItem('token', token);
        return this.websocket.refreshAccountInfo();
      })
    );
  }

  checkPassword(password: string): number {
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

  logout() {
    localStorage.clear();
    this.windowManagerService.reset();

    this.websocket.request({ action: 'logout' });
    this.websocket.loggedIn = false;

    this.router.navigateByUrl('/login').then(() => {
      (this.routeReuseStrategy as AppRouteReuseStrategy).reset();
    });
  }

}
