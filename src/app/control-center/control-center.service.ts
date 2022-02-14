import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DeviceService} from '../api/devices/device.service';
import {map} from 'rxjs/operators';
import {SidebarMenuItem} from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import {DeviceSidebarMenuItem} from './control-center-sidebar-menu/device-sidebar-menu-item';

@Injectable({
  providedIn: 'root'
})
export class ControlCenterService implements Resolve<void> {
  deviceSidebarMenuItems: SidebarMenuItem[] = [];

  constructor(private deviceService: DeviceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return this.refreshDevices();
  }

  refreshDevices(): Observable<void> {
    return this.deviceService.getDevices().pipe(map(response => {
      this.deviceSidebarMenuItems.length = 0;
      this.deviceSidebarMenuItems.push(...response.devices.map(device => new DeviceSidebarMenuItem(device)));
      this.deviceSidebarMenuItems.push({title: 'Build new device', routerLink: '/create-device'});
    }));
  }

}
