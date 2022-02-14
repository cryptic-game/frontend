import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WindowDelegate} from '../window/window-delegate';
import {WindowManager} from '../window-manager/window-manager';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss']
})
export class DesktopMenuComponent implements OnInit, OnDestroy {
  @Input() windowManager: WindowManager;
  @Output() startMenu = new EventEmitter();

  now: Date;
  intervalHandle: any;

  constructor() {
    this.now = new Date();
  }

  ngOnInit() {
    this.intervalHandle = setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalHandle);
  }

  activateOrMinimize(window: WindowDelegate) {
    if (window.position.active || window.position.minimized) {
      this.windowManager.toggleMinimize(window);
    } else {
      this.windowManager.focusWindow(window);
    }
  }
}
