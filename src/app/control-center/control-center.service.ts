import { Injectable } from '@angular/core';
import { Device } from '../api/devices/device';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceService } from '../api/devices/device.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlCenterService implements Resolve<Device[]> {
  devices: Device[] = [];

  constructor(private deviceService: DeviceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Device[]> | Promise<Device[]> | Device[] {
    return this.deviceService.getDevices().pipe(map(response => {
      this.devices = response.devices;
      return response.devices;
    }));
  }

  getDevice(uuid: string) {
    return this.devices.find(device => device.uuid === uuid);
  }

}
