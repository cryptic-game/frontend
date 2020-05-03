import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { catchError, flatMap, map } from 'rxjs/operators';
import { DeviceService } from '../api/devices/device.service';
import { DesktopDeviceService } from './desktop-device.service';

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {

  constructor(private router: Router,
              private websocket: WebsocketService,
              private deviceService: DeviceService,
              private desktopDeviceService: DesktopDeviceService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.websocket.trySession().pipe(flatMap(success => {
      if (success) {
        return this.deviceService.getDeviceInfo(next.queryParamMap.get('device')).pipe(
          map(deviceInfo => {
            const allowed = deviceInfo.powered_on && deviceInfo.owner === this.websocket.account.uuid;
            if (allowed) {
              this.desktopDeviceService.activeDevice = deviceInfo;
            }
            return allowed;
          }),
          catchError(() => of(false)),
          map(allowed => {
            if (!allowed) {
              this.router.navigate([]).then();
            }
            return allowed;
          })
        );
      } else {
        this.router.navigate(['login']).then();
        return of(false);
      }
    }));
  }

}
