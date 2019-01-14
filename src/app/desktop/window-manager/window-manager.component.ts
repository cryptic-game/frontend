import { Component, OnInit } from '@angular/core';
import { WindowManagerService } from './window-manager.service';

@Component({
  selector: 'app-window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss']
})
export class WindowManagerComponent implements OnInit {
  constructor(public windowManager: WindowManagerService) {}

  ngOnInit() {}
}
