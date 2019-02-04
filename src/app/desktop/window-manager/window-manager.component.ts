import { Component, OnInit } from '@angular/core';
import { WindowManagerService } from './window-manager.service';
import { TerminalComponent } from '../windows/terminal/terminal.component';

@Component({
  selector: 'app-window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss']
})
export class WindowManagerComponent implements OnInit {
  constructor(public windowManager: WindowManagerService) {}

  ngOnInit() {
    this.windowManager.openWindow(new TerminalComponent());
  }
}
