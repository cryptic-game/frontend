import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {Router} from '@angular/router';
import {Device} from 'src/app/api/devices/device';

@Component({
  selector: 'app-control-center-computer-menu',
  templateUrl: './control-center-computer-menu.component.html',
  styleUrls: ['./control-center-computer-menu.component.scss']
})
export class ControlCenterComputerMenuComponent implements OnInit {

  @Input() menu: SidebarMenu;
  @Input() expanded!: boolean;
  @Output() expandChange = new EventEmitter<boolean>();

  @Input() devices: Device[];

  // 0: off = Offline
  // 1: on = Online
  // 2: amoff = Am Einschalten
  // 3: amon = Am Ausschalten
  // I know I just could have used an enum will probably change it => Todo
  states: any[] = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.updatePcState();
  }

  updatePcState() {

    if (this.devices != undefined) {
      this.devices.forEach(device => {
        if (!device.powered_on) this.states.push({uuid: device.uuid, state: 0})
        else this.states.push({uuid: device.uuid, state:1})
      });
    } 

    
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
