import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {Params, Router} from '@angular/router';
import { DeviceService } from 'src/app/api/devices/device.service';
import { WebsocketService } from 'src/app/websocket.service';
import {Device} from 'src/app/api/devices/device';

@Component({
  selector: 'app-control-center-computer-menu',
  templateUrl: './control-center-computer-menu.component.html',
  styleUrls: ['./control-center-computer-menu.component.scss']
})
export class ControlCenterComputerMenuComponent {

  @Input() menu: SidebarMenu;
  @Input() expanded!: boolean;
  @Output() expandChange = new EventEmitter<boolean>();

  @Input() devices: Device[];

  constructor(private router: Router) {
    this.updatePowerState();
  }

  async updatePowerState() {
    // this.deviceService.getDevices().subscribe(devices => {
    //   this.devices = devices.devices;
    // });
  }

  itemClicked(item: SidebarMenuItem) {
    this.router.navigate([item.routerLink], {queryParams: item.queryParams}).then();
    this.expanded = false;
    this.expandChange.emit(this.expanded);
  }

  newPcClicked() {
    this.router.navigate(['/create-device']).then();
    this.expanded = false;
    this.expandChange.emit(this.expanded);
  }

  isItemActive(item: SidebarMenuItem) {
    // had to do this without routerLinkActive because of the lack of https://github.com/angular/angular/issues/31154
    if (!item.routerLink) {
      return false;
    }
    if (this.router.isActive(this.router.createUrlTree([item.routerLink], {queryParams: item.queryParams}), false)) {
      return true;
    }
     return false;
  }

}
