import {SidebarMenuItem} from './control-center-sidebar-menu.component';
import {Params} from '@angular/router';
import {Device} from '../../api/devices/device';

export class DeviceSidebarMenuItem implements SidebarMenuItem {
  routerLink = '/device';
  device: Device;

  constructor(device: Device) {
    this.device = device;
  }

  get title(): string {
    return this.device.name;
  }

  get queryParams(): Params {
    return {device: this.device.uuid};
  }
}
