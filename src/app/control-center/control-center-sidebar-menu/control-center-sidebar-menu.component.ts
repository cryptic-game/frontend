import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Params, Router } from '@angular/router';

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

  @Input() menu: SidebarMenu;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  menuClicked() {
    if (this.menu.items.length !== 0) {
      this.expanded = !this.expanded;
    }

    if (this.menu.routerLink) {
      this.router.navigate([this.menu.routerLink], { queryParams: this.menu.queryParams }).then();
    }
  }

  itemClicked(item: SidebarMenuItem) {
    this.router.navigate([item.routerLink], { queryParams: item.queryParams }).then();
  }

  isItemActive(item: SidebarMenuItem) {
    // had to do this without routerLinkActive because of the lack of https://github.com/angular/angular/issues/31154
    if (!item.routerLink) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([item.routerLink], { queryParams: item.queryParams }), false);
  }

}

export class SidebarMenu {
  title: string;
  icon: string;
  items: SidebarMenuItem[];
  displayCount: boolean;
  specialItems: number;
  routerLink?: string;
  queryParams?: Params;

  constructor(title: string,
              icon: string,
              options: {
                items?: SidebarMenuItem[]; displayCount?: boolean; specialItems?: number;
                routerLink?: string; queryParams?: Params;
              } = {}) {
    this.title = title;
    this.icon = icon;
    this.items = options.items ?? [];
    this.displayCount = options.displayCount ?? false;
    this.specialItems = options.specialItems ?? 0;
    this.routerLink = options.routerLink;
    this.queryParams = options.queryParams;
  }

  getDisplayCount(): number {
    return Math.max(this.items.length - this.specialItems, 0);
  }
}

export interface SidebarMenuItem {
  title: string;
  routerLink?: string;
  queryParams?: Params;
}
