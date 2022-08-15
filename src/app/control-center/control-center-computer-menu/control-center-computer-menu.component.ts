import { Component, OnInit, Input } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-control-center-computer-menu',
  templateUrl: './control-center-computer-menu.component.html',
  styleUrls: ['./control-center-computer-menu.component.scss']
})
export class ControlCenterComputerMenuComponent implements OnInit {

  @Input() menu: SidebarMenu;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  itemClicked(item: SidebarMenuItem) {
    this.router.navigate([item.routerLink], {queryParams: item.queryParams}).then();
    console.log('item clicked: ' + item.routerLink);
  }

  newPcClicked() {
    this.router.navigate(['/create-device']).then();
  }

  isItemActive(item: SidebarMenuItem) {
    // had to do this without routerLinkActive because of the lack of https://github.com/angular/angular/issues/31154
    if (!item.routerLink) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([item.routerLink], {queryParams: item.queryParams}), false);
  }

}
