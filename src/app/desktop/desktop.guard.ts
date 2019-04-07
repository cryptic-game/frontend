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
    if (localStorage.getItem('token') === null) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}
