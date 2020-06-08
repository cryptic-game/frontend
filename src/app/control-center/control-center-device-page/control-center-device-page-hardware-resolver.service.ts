import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HardwareService } from '../../api/hardware/hardware.service';
import { EMPTY, Observable } from 'rxjs';
import { ControlCenterService } from '../control-center.service';
import { DeviceHardware } from '../../api/hardware/device-hardware';

@Injectable({
  providedIn: 'root'
})
export class ControlCenterDevicePageHardwareResolverService implements Resolve<DeviceHardware> {

  constructor(private router: Router, private hardwareService: HardwareService, private controlCenterService: ControlCenterService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DeviceHardware> | Observable<never> {
    const deviceUUID = route.queryParamMap.get('device');
    if (!this.controlCenterService.getDevice(deviceUUID)) {
      this.router.navigateByUrl('/').then();
      return EMPTY;
    }

    return this.hardwareService.getDeviceParts(deviceUUID);
  }

}
