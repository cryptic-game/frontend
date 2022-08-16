import {Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-control-center-sidebar-menu',
  animations: [
    trigger('expandCollapse', [
      transition('void => *', [
        style({
          opacity: '0',
          transform: 'translateX(-10%)'
        }),
        animate('200ms')
      ]),
      transition('* => void', [
        animate('200ms', style({
          opacity: '0',
          transform: 'translateX(-10%)'
        }))
      ])
    ])
  ],
  templateUrl: './control-center-sidebar-menu.component.html',
  styleUrls: ['./control-center-sidebar-menu.component.scss']
})
export class ControlCenterSidebarMenuComponent {
  expanded = false;
  computerActive = false;

  @Input() menu: SidebarMenu;

  @ViewChild('computerMenu') computerMenu: ElementRef;
  @ViewChild('button') button: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {
    this.renderer.listen('window', 'click',(e:Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if(this.expanded) {
        if(!this.computerMenu.nativeElement.contains(e.target) && !this.button.nativeElement.contains(e.target)) {
          this.expanded = false;
        }
      }
      
    });
  }

  menuClicked() {
    if (this.menu.items.length !== 0 || this.menu.specialItems === 1) {
      this.expanded = !this.expanded;
    }


    if (this.menu.routerLink) {
      this.router.navigate([this.menu.routerLink], {queryParams: this.menu.queryParams}).then();
    } else if (this.menu.link) {
      window.open(this.menu.link, '_blank');
    }
  }

  isItemActive(item: SidebarMenuItem) {
    if (!this.computerActive) {
      // had to do this without routerLinkActive because of the lack of https://github.com/angular/angular/issues/31154
    if (!item.routerLink) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([item.routerLink], {queryParams: item.queryParams}), false);
    } else {
      return true;
    }
    
  }

}

export class SidebarMenu {
  title: string;
  icon: string;
  header?: string;
  link?: string;
  items: SidebarMenuItem[];
  displayCount: boolean;
  specialItems: number;
  routerLink?: string;
  queryParams?: Params;

  constructor(title: string,
              icon: string,
              options: {
                items?: SidebarMenuItem[]; displayCount?: boolean; specialItems?: number;
                routerLink?: string; queryParams?: Params; header?: string; link?: string;
              } = {}) {
    this.title = title;
    this.icon = icon;
    this.header = options.header;
    this.link = options.link;
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
