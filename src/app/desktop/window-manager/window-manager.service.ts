import { Injectable } from '@angular/core';
import { Device } from '../../api/devices/device';
import { WindowManager } from './window-manager';

/**
 * This service holds the window managers for all devices
 */
@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private devices: { [device: string]: WindowManager } = {};

  constructor() {
  }

  /**
   * Closes all windows and removes all stored window managers.
   */
  reset() {
    Object.values(this.devices).forEach(manager => manager.closeAllWindows());
    Object.keys(this.devices).forEach(key => delete this.devices[key]);
  }

  /**
   * Returns a window manager for a given device. A new one will be created if no matching one exists yet.
   * @param device The device to get the window manager for
   */
  forDevice(device: Device) {
    const manager = this.devices[device.uuid];
    if (manager) {
      manager.device.name = device.name;  // update the device name
      return manager;
    } else {
      return this.devices[device.uuid] = new WindowManager(device);
    }
  }

}
