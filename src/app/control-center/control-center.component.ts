import { Component, OnInit } from '@angular/core';
import { SidebarMenu } from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import { ControlCenterService } from './control-center.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.scss']
})
export class ControlCenterComponent implements OnInit {

  menus: SidebarMenu[] = [
    new SidebarMenu(
      'Computers',
      'menu_computers.svg',
      { items: this.controlCenterService.deviceSidebarMenuItems, displayCount: true, specialItems: 1 }
    ),
    new SidebarMenu('Inventory', 'menu_inventory.svg', { routerLink: '/inventory' }),
    new SidebarMenu('Settings', 'menu_settings.svg', { routerLink: '/settings' }),
    new SidebarMenu('Sound', 'menu_sound.svg', { routerLink: '/sound' }),
    new SidebarMenu('Changelog', 'menu_changelog.svg', { routerLink: '/changelog' })
  ];

  constructor(private controlCenterService: ControlCenterService) {
  }

  ngOnInit(): void {
  }

}
