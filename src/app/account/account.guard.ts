import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {WebsocketService} from '../websocket.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {

  constructor(private router: Router, private websocket: WebsocketService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.websocket.trySession().pipe(map(success => {
      if (success) {
        this.router.navigate([]).then();
        return false;
      } else {
        return true;
      }
    }));
  }

}
