import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WebsocketService} from '../websocket.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {

  constructor(private router: Router,
              private websocket: WebsocketService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.websocket.trySession().pipe(map(success => {
      if (success) {
        return true;
      } else {
        this.router.navigateByUrl('/login').then();
        return false;
      }
    }));
  }

}
