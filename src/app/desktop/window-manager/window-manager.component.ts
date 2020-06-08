import { Component, Input, OnInit } from '@angular/core';
import { WindowManagerService } from './window-manager.service';
import { Device } from '../../api/devices/device';
import { WindowManager } from './window-manager';

@Component({
  selector: 'app-window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss']
})
export class WindowManagerComponent implements OnInit {
  windowManager: WindowManager;

  @Input()
  set device(device: Device) {
    this.windowManager = this.windowManagerService.forDevice(device);
  }

  constructor(private windowManagerService: WindowManagerService) {
  }

  ngOnInit() {
  }
}
