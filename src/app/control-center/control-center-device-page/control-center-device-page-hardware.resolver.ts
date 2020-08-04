import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HardwareService } from '../../api/hardware/hardware.service';
import { EMPTY, Observable } from 'rxjs';
import { DeviceHardware } from '../../api/hardware/device-hardware';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlCenterDevicePageHardwareResolver implements Resolve<DeviceHardware> {

  constructor(private router: Router, private hardwareService: HardwareService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DeviceHardware> | Observable<never> {
    const deviceUUID = route.queryParamMap.get('device');

    return this.hardwareService.getDeviceParts(deviceUUID).pipe(catchError(() => {
      this.router.navigateByUrl('/').then();
      return EMPTY;
    }));
  }

}
