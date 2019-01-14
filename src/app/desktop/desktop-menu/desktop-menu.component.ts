import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WindowManagerService} from '../window-manager/window-manager.service';
import {WindowDelegate} from '../window/window-delegate.class';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss']
})
export class DesktopMenuComponent implements OnInit {
  constructor(public windowManager: WindowManagerService) {
  }

  @Output() startMenu = new EventEmitter();

  ngOnInit() {
  }

  activateOrMinimize(window: WindowDelegate) {
    if (window.position.active || window.position.minimized) {
      this.windowManager.toggleMinimize(window);
    } else {
      this.windowManager.focusWindow(window);
    }
  }

}
