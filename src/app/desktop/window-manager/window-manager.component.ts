import {Component, OnInit} from '@angular/core';
import {WindowManagerService} from './window-manager.service';
import {TestWindowComponent} from '../windows/test-window/test-window.component';

@Component({
  selector: 'app-window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss']
})
export class WindowManagerComponent implements OnInit {

  constructor(protected windowManager: WindowManagerService) { }

  ngOnInit() {
    this.windowManager.openWindow(new TestWindowComponent());
    this.windowManager.openWindow(new TestWindowComponent());
    this.windowManager.openWindow(new TestWindowComponent());
    this.windowManager.openWindow(new TestWindowComponent());
  }

}
