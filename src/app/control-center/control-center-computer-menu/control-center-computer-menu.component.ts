import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-control-center-computer-menu',
  templateUrl: './control-center-computer-menu.component.html',
  styleUrls: ['./control-center-computer-menu.component.scss']
})
export class ControlCenterComputerMenuComponent {

  @Input() menu: SidebarMenu;
  @Input() expanded!: boolean;
  @Output() expandChange = new EventEmitter<boolean>();

  @Input() computerActive!: boolean;
  @Output() computerActiveChange = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  itemClicked(item: SidebarMenuItem) {
    this.router.navigate([item.routerLink], {queryParams: item.queryParams}).then();
    console.log('item clicked: ' + item.routerLink);
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
      this.computerActive = true;
      this.computerActiveChange.emit(this.computerActive);
      return true;
    }
     return false;
  }

}
