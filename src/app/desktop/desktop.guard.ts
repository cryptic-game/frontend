import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {
  constructor(private router: Router, private websocket: WebsocketService) {
  }

  /**
   * - localStorage.token === null --> go back to login; denied
   * - action: info successful --> allowed
   * - action: info failed -->
   *   -- login with token successful --> allowed
   *   -- login with token failed --> remove current token; go back to login; denied
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token') === null) {
      this.goToLogin();
      return false;
    }

    return this.websocket.request({ action: 'info' }).pipe(
      map(() => {
        return true;
      }), catchError(() => {
        return this.websocket.request({
          'action': 'session',
          'token': localStorage.getItem('token')
        }).pipe(
          map(sessionResponse => {
            localStorage.setItem('token', sessionResponse['token']);
            return true;
          }), catchError(() => {
            localStorage.removeItem('token');
            this.goToLogin();
            return of(false);
          }));
      })
    );

  }

  goToLogin() {
    this.router.navigateByUrl('/login').then();
  }
}
