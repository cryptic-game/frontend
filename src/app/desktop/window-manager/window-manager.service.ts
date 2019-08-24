import { Injectable } from '@angular/core';
import { WindowDelegate } from '../window/window-delegate';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  windows: WindowDelegate[] = [];
  taskList: WindowDelegate[] = [];
  activeWindow: WindowDelegate;

  constructor() {
  }

  openWindow(win: WindowDelegate) {
    this.windows.push(win);
    this.taskList.push(win);
    if (this.activeWindow) {
      this.activeWindow.position.active = false;
      win.position.zIndex = this.activeWindow.position.zIndex + 1;
    }
    win.position.active = true;
    this.activeWindow = win;

    this.activeWindow.component.events.next('open');
  }

  sortWindows() {
    if (this.windows.length === 0) {
      this.activeWindow = null;
      return;
    }

    this.windows.sort((a, b) => a.position.zIndex - b.position.zIndex);
    let highestZIndex = 1;
    for (const win of this.windows) {
      win.position.zIndex = highestZIndex++;
      win.position.active = false;
    }
    this.activeWindow = this.windows[this.windows.length - 1];
    this.activeWindow.position.active = true;
  }

  closeWindow(window: WindowDelegate) {
    window.component.events.next('close');

    this.windows.splice(this.windows.findIndex(win => win === window), 1);
    this.taskList.splice(this.taskList.findIndex(win => win === window), 1);
    this.sortWindows();
  }

  closeAllWindows() {
    this.windows = [];
    this.taskList = [];
  }

  focusWindow(window: WindowDelegate) {
    window.position.active = true;
    if (this.activeWindow === window) {
      return;
    }

    window.component.events.next('focus');

    window.position.zIndex = this.windows[this.windows.length - 1].position.zIndex + 1;
    this.sortWindows();
  }

  unfocus() {
    if (this.activeWindow) {
      this.activeWindow.position.active = false;

      this.activeWindow.component.events.next('unfocus');

      this.activeWindow = null;
    }
  }

  toggleMinimize(window: WindowDelegate) {
    window.position.minimized = !window.position.minimized;
    if (window.position.minimized) {
      window.position.zIndex = -1;
      this.sortWindows();
      this.focusWindow(this.windows[this.windows.length - 1]);

      this.activeWindow.component.events.next('minimize');
    } else {
      this.focusWindow(window);
      this.activeWindow.component.events.next('maximize');
    }
  }

}
