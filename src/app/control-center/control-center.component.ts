import {Component} from '@angular/core';
import {SidebarMenu} from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import {ControlCenterService} from './control-center.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.scss']
})
export class ControlCenterComponent {

  menus: SidebarMenu[] = [
    new SidebarMenu(
      $localize`Computer`,
      'device-desktop',
      $localize`Game`,
      {items: this.controlCenterService.deviceSidebarMenuItems, displayCount: true, specialItems: 1}
    ),
    new SidebarMenu($localize`Inventory`, 'briefcase', $localize`Game`, {routerLink: '/inventory'}),
    new SidebarMenu($localize`Account`, 'user', $localize`Other`, {routerLink: '/settings'}),
    // new SidebarMenu($localize`Sound`, 'volume', $localize`other`, {routerLink: '/sound'}),
    new SidebarMenu($localize`Changelog`, 'code', $localize`Other`, {routerLink: '/changelog'})
  ];

  constructor(private controlCenterService: ControlCenterService) {
  }

}
