import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Device } from '../api/devices/device';
import { EMPTY, Observable, of } from 'rxjs';
import { DeviceService } from '../api/devices/device.service';
import { catchError, flatMap } from 'rxjs/operators';
import { WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DesktopDeviceResolver implements Resolve<Device> {

  constructor(private router: Router, private apiService: WebsocketService, private deviceService: DeviceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Device> | Observable<never> {
    return this.deviceService.getDeviceInfo(route.queryParamMap.get('device')).pipe(
      flatMap(deviceInfo => {
        if (deviceInfo.powered_on && deviceInfo.owner === this.apiService.account.uuid) {
          return of(deviceInfo);
        } else {
          this.router.navigateByUrl('/').then();
          return EMPTY;
        }
      }),
      catchError(() => {
        this.router.navigateByUrl('/').then();
        return EMPTY;
      })
    );
  }

}
