import { Injectable } from '@angular/core';
import { Device } from '../api/devices/device';

@Injectable({
  providedIn: 'root'
})
export class DesktopDeviceService {
  public activeDevice: Device = {
    name: '',
    owner: '',
    powered_on: false,
    uuid: ''
  };

  constructor() {
  }
}
