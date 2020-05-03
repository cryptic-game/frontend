import { Component, OnInit } from '@angular/core';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuItemSelectEvent,
  SidebarSelectEvent
} from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import { DeviceHardware, HardwareService } from '../api/hardware/hardware.service';
import { DeviceService } from '../api/devices/device.service';
import { Device } from '../api/devices/device';
import { from } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.scss']
})
export class ControlCenterComponent implements OnInit {
  activePage: ControlCenterPage = ControlCenterPage.NONE;

  devices: SidebarMenuItem[] = [];
  activeDevice?: DeviceSidebarMenuItem = null;

  menus: SidebarMenu[] = [
    new SidebarMenu('Computers', 'menu_computers.svg', this.devices, true),
    new SidebarMenu('Servers', 'menu_servers.svg', [], true),
    new SidebarMenu('Settings', 'menu_settings.svg'),
    new SidebarMenu('Sound', 'menu_sound.svg'),
    new SidebarMenu('Changelog', 'menu_changelog.svg')
  ];

  constructor(private hardwareService: HardwareService, private deviceService: DeviceService) {
  }

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe(devices => {
      from(devices.devices).pipe(
        flatMap(device =>
          this.hardwareService.getDeviceParts(device.uuid).pipe(map(deviceHardware =>
            new DeviceSidebarMenuItem(device, deviceHardware))
          )
        ),
        toArray()
      ).subscribe(items => {
        this.devices.length = 0;
        this.devices.push(...items);
        this.devices.push(createDeviceMenuItem);
      });
    });
  }

  menuSelect(event: SidebarSelectEvent) {
    if (event.menu === this.menus[0] && event instanceof SidebarMenuItemSelectEvent) {
      if (event.item === createDeviceMenuItem) {
        this.activePage = ControlCenterPage.DEVICE_CREATE;
      } else if (event.item instanceof DeviceSidebarMenuItem) {
        this.activeDevice = event.item;
        this.activePage = ControlCenterPage.DEVICE;
      }
    } else if (event.menu === this.menus[2]) {
      this.activePage = ControlCenterPage.SETTINGS;
    } else if (event.menu === this.menus[3]) {
      this.activePage = ControlCenterPage.SOUND;
    } else if (event.menu === this.menus[4]) {
      this.activePage = ControlCenterPage.CHANGELOG;
    } else {
      this.activePage = ControlCenterPage.NONE;
    }
  }

}

export class DeviceSidebarMenuItem implements SidebarMenuItem {
  get title(): string {
    return this.device.name;
  }

  device: Device;
  hardware: DeviceHardware;

  constructor(device: Device, hardware: DeviceHardware) {
    this.device = device;
    this.hardware = hardware;
  }
}

const createDeviceMenuItem: SidebarMenuItem = new class implements SidebarMenuItem {
  title = '+';
  // noinspection JSUnusedGlobalSymbols
  createDeviceItem = true;
};

export enum ControlCenterPage {
  NONE,
  DEVICE,
  DEVICE_CREATE,
  SETTINGS,
  SOUND,
  CHANGELOG
}
