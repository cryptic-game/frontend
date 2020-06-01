import { Component, OnInit } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import { HardwareService } from '../api/hardware/hardware.service';
import { DeviceService } from '../api/devices/device.service';
import { Device } from '../api/devices/device';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ControlCenterService } from './control-center.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.scss']
})
export class ControlCenterComponent implements OnInit {

  devices: SidebarMenuItem[] = [];

  menus: SidebarMenu[] = [
    new SidebarMenu('Computers', 'menu_computers.svg', { items: this.devices, displayCount: true }),
    new SidebarMenu('Servers', 'menu_servers.svg', { items: [], displayCount: true }),
    new SidebarMenu('Inventory', 'menu_inventory.svg', { routerLink: '/inventory' }),
    new SidebarMenu('Settings', 'menu_settings.svg', { routerLink: '/settings' }),
    new SidebarMenu('Sound', 'menu_sound.svg', { routerLink: '/sound' }),
    new SidebarMenu('Changelog', 'menu_changelog.svg', { routerLink: '/changelog' })
  ];

  constructor(private hardwareService: HardwareService,
              private deviceService: DeviceService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private controlCenterService: ControlCenterService) {
    this.devices.length = 0;
    this.devices.push(...this.controlCenterService.devices.map(device => new DeviceSidebarMenuItem(device)));
    this.devices.push({ title: '+', routerLink: '/create-device' });
  }

  ngOnInit(): void {
  }

}

export class DeviceSidebarMenuItem implements SidebarMenuItem {
  get title(): string {
    return this.device.name;
  }

  get queryParams(): Params {
    return { device: this.device.uuid };
  }

  routerLink = '/device';

  device: Device;

  constructor(device: Device) {
    this.device = device;
  }
}
