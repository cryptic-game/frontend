import { Component, Input, OnInit } from '@angular/core';
import { WindowManagerService } from './window-manager.service';
import { Device } from '../../api/devices/device';
import { WindowManager } from './window-manager';

@Component({
  selector: 'app-window-manager',
  templateUrl: './window-manager.component.html',
  styleUrls: ['./window-manager.component.scss']
})
export class WindowManagerComponent   {
  @Input() active;

  windowManager: WindowManager;

  constructor(private windowManagerService: WindowManagerService) {
  }

  @Input()
  set device(device: Device) {
    this.windowManager = this.windowManagerService.forDevice(device);
  }
}
