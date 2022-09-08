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
      {items: this.controlCenterService.deviceSidebarMenuItems, displayCount: true, specialItems: 1, header: $localize`Game`}
    ),
    new SidebarMenu($localize`Inventory`, 'briefcase', { routerLink: '/inventory' }),
    new SidebarMenu($localize`Network`, 'affiliate', { routerLink: '/network' }),

    // Other
    new SidebarMenu($localize`Account`, 'user', { routerLink: '/settings', header: $localize`Other` }),
    new SidebarMenu($localize`Wiki`, 'lifebuoy', { link: 'https://wiki.cryptic-game.net/' }),
    new SidebarMenu($localize`Bug Report`, 'bug', { link: 'https://github.com/cryptic-game/frontend/issues/new?labels=bug&template=BUG_REPORT.md' }),
    new SidebarMenu($localize`Server Status`, 'activity', { link: 'https://status.cryptic-game.net/' }),
    // new SidebarMenu($localize`Sound`, 'volume' {routerLink: '/sound'}),
    new SidebarMenu($localize`Changelog`, 'code', { routerLink: '/changelog' }),
    new SidebarMenu($localize`Impressum`, 'license', { link: 'https://the-morpheus.de/#contact/' })
  ];

  constructor(private controlCenterService: ControlCenterService) {
  }

}
