import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WindowManagerService } from '../window-manager/window-manager.service';
import { WindowDelegate } from '../window/window-delegate';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss']
})
export class DesktopMenuComponent implements OnInit {
  @Output() startMenu = new EventEmitter();

  now: Date;

  constructor(public windowManager: WindowManagerService) {
    this.now = new Date();

    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  ngOnInit() {}

  activateOrMinimize(window: WindowDelegate) {
    if (window.position.active || window.position.minimized) {
      this.windowManager.toggleMinimize(window);
    } else {
      this.windowManager.focusWindow(window);
    }
  }
}
