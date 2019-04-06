import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { CLIENT } from "../websocket.service";

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (sessionStorage.getItem('token') === null) {
      this.router.navigateByUrl('/login');
      return false;
    }

    CLIENT.request({
      "action": "info"
    }).subscribe(response => {
      if(response.error != null) {
        CLIENT.request({
          "action": "session",
          "token": sessionStorage.getItem('token')
        }).subscribe(response2 => {
          if(response2.error != null) {
            this.router.navigateByUrl('/login');
            return false;
          } else {
            sessionStorage.setItem('token', response2.token);
            CLIENT.request({
              "action": "info"
            }).subscribe(response => {
              localStorage.setItem('username', response.name);
              localStorage.setItem('email', response.mail);
              localStorage.setItem('created', response.created);
              localStorage.setItem('last', response.last);
            });
          }
        });
      }
    });

    return true;
  }
}
