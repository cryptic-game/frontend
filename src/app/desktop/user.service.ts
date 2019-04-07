import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private websocket: WebsocketService, private router: Router) {
  }

  logout(token) {
    localStorage.clear();
    sessionStorage.clear();

    this.websocket.reconnect();

    this.router.navigate(['login']);
  }
}
