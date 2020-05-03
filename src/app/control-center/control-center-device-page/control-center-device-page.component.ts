import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceSidebarMenuItem } from '../control-center.component';
import { WebsocketService } from '../../websocket.service';
import { DeviceService } from '../../api/devices/device.service';
import { from } from 'rxjs';
import { filter, flatMap, map, switchMap, toArray } from 'rxjs/operators';
import { DeviceUtilization } from '../../api/devices/device';

@Component({
  selector: 'app-control-center-device-page',
  templateUrl: './control-center-device-page.component.html',
  styleUrls: ['./control-center-device-page.component.scss']
})
export class ControlCenterDevicePageComponent implements OnInit {
  private _device: DeviceSidebarMenuItem;
  services: {
    service: { uuid: string, name: string, running: boolean },
    usage: DeviceUtilization
  }[] = [];

  @ViewChild('deviceName') deviceNameField;

  @Input()
  set device(device: DeviceSidebarMenuItem) {
    this._device = device;
    if (device && device.device.powered_on) {
      this.webSocket.ms('service', ['list'], { device_uuid: device.device.uuid }).pipe(
        switchMap(response => from(response.services as { uuid: string, name: string, running: boolean }[])),
        filter(service => service.running),
        flatMap(service =>
          this.deviceService.getServiceResourceUsage(service.uuid).pipe(map(serviceUsage =>
              ({ service: service, usage: new DeviceUtilization(serviceUsage) })
            )
          )),
        toArray(),
        map(serviceUsages => serviceUsages.sort((a, b) => a.service.name.localeCompare(b.service.name)))
      ).subscribe(serviceUsages => {
        this.services.length = 0;
        this.services.push(...serviceUsages);
      });
    } else {
      this.services = [];
    }
  }

  get device() {
    return this._device;
  }

  constructor(private webSocket: WebsocketService, private deviceService: DeviceService) {
  }

  ngOnInit(): void {
  }

  deviceNameKeyPressed(event: KeyboardEvent): boolean {
    const nameLength = this.deviceNameField.nativeElement.innerText.length;
    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && nameLength >= 1) {
      this.deviceService.renameDevice(this.device.device.uuid, this.deviceNameField.nativeElement.innerText).subscribe(response => {
        this.device.device.name = response['name'];
      });
      this.deviceNameField.nativeElement.contentEditable = false;
      return false;
    }
    return event.key.match(/^[a-zA-Z0-9\-_]$/) != null && nameLength < 15;
  }

  startRenaming(): void {
    this.deviceNameField.nativeElement.contentEditable = true;
    this.deviceNameField.nativeElement.focus();
  }

  togglePower() {
    this.deviceService.togglePower(this._device.device.uuid).subscribe(device => {
      this._device.device = device;
      this.device = this._device;  // update running processes
    });
  }
}
