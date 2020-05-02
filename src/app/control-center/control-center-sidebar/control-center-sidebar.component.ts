import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import {
  ControlCenterSidebarMenuComponent,
  SidebarMenu,
  SidebarSelectEvent
} from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import { WebsocketService } from '../../websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-center-sidebar',
  templateUrl: './control-center-sidebar.component.html',
  styleUrls: ['./control-center-sidebar.component.scss']
})
export class ControlCenterSidebarComponent implements OnInit {
  @ViewChildren(ControlCenterSidebarMenuComponent) menuComponents: ControlCenterSidebarMenuComponent[];

  @Input() menus: SidebarMenu[];
  @Output() menuSelect: EventEmitter<SidebarSelectEvent> = new EventEmitter<SidebarSelectEvent>();

  activeMenu: SidebarMenu;

  constructor(public apiService: WebsocketService, private router: Router) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['login']).then();
  }

  menuSelected(event: SidebarSelectEvent) {
    this.menuComponents.filter(component => component.menu !== event.menu).forEach(component => component.activeItem = null);
    this.activeMenu = event.menu;
    this.menuSelect.emit(event);
  }

}

