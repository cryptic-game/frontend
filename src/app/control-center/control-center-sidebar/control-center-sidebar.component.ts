import {Component, Input, ViewChildren} from '@angular/core';
import {
  ControlCenterSidebarMenuComponent,
  SidebarMenu
} from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {WebsocketService} from '../../websocket.service';
import {AccountService} from '../../account/account.service';

@Component({
  selector: 'app-control-center-sidebar',
  templateUrl: './control-center-sidebar.component.html',
  styleUrls: ['./control-center-sidebar.component.scss']
})
export class ControlCenterSidebarComponent {
  @ViewChildren(ControlCenterSidebarMenuComponent) menuComponents: ControlCenterSidebarMenuComponent[];

  @Input() menus: SidebarMenu[];

  constructor(public apiService: WebsocketService, private accountService: AccountService) {
  }

  logout(): void {
    this.accountService.logout();
  }
}
