import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WindowDelegate } from '../window/window-delegate';
import { WindowManager } from '../window-manager/window-manager';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss']
})
export class DesktopMenuComponent implements OnInit {
  @Input() windowManager: WindowManager;
  @Output() startMenu = new EventEmitter();

  now: Date;

  constructor() {
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
