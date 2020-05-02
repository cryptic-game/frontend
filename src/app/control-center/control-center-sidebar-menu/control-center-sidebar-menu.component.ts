import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-control-center-sidebar-menu',
  animations: [
    trigger('expandCollapse', [
      transition('void => *', [
        style({
          opacity: '0',
          transform: 'scaleY(0.5) translateY(-10%)'
        }),
        animate('200ms')
      ]),
      transition('* => void', [
        animate('200ms', style({
          opacity: '0',
          transform: 'scaleY(0.5) translateY(-10%)'
        }))
      ])
    ]),
    trigger('arrowUpwardsDownwards', [
      state('upwards', style({})),
      state('downwards', style({
        transform: 'rotateX(-180deg)'
      })),
      transition('upwards <=> downwards', [
        animate('200ms')
      ])
    ])
  ],
  templateUrl: './control-center-sidebar-menu.component.html',
  styleUrls: ['./control-center-sidebar-menu.component.scss']
})
export class ControlCenterSidebarMenuComponent implements OnInit {
  expanded = false;
  activeItem?: SidebarMenuItem = null;

  @Input() menu: SidebarMenu;
  @Output() menuSelect: EventEmitter<SidebarSelectEvent> = new EventEmitter<SidebarSelectEvent>();

  constructor() {
  }

  ngOnInit(): void {
  }

  menuClicked() {
    if (this.menu.expandable) {
      if (this.menu.items.length !== 0) {
        this.expanded = !this.expanded;
      }
    } else {
      this.menuSelect.emit(new SidebarMenuSelectEvent(this.menu));
    }
  }

  itemClicked(item: SidebarMenuItem) {
    this.menuSelect.emit(new SidebarMenuItemSelectEvent(this.menu, item));
    this.activeItem = item;
  }

}

export class SidebarMenu {
  title: string;
  items: SidebarMenuItem[];
  expandable: boolean;
  displayCount: boolean;

  constructor(title: string, items?: SidebarMenuItem[], displayCount: boolean = false) {
    this.title = title;
    if (items instanceof Array) {
      this.expandable = true;
      this.items = items;
    } else {
      this.expandable = false;
      this.items = [];
    }
    this.displayCount = displayCount;
  }
}

export interface SidebarMenuItem {
  title: string;
}

export interface SidebarSelectEvent {
  menu: SidebarMenu;
}

export class SidebarMenuSelectEvent implements SidebarSelectEvent {
  menu: SidebarMenu;

  constructor(menu: SidebarMenu) {
    this.menu = menu;
  }

}

export class SidebarMenuItemSelectEvent implements SidebarSelectEvent {
  menu: SidebarMenu;
  item: SidebarMenuItem;

  constructor(menu: SidebarMenu, item: SidebarMenuItem) {
    this.menu = menu;
    this.item = item;
  }
}
