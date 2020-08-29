import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HardwareService } from '../../../api/hardware/hardware.service';
import { Device, DeviceUtilization } from '../../../api/devices/device';
import { DeviceHardware } from '../../../api/hardware/device-hardware';
import { DesktopDeviceService } from '../../desktop-device.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent extends WindowComponent implements OnInit, OnDestroy {
  resourceNotifySubscription: Subscription;

  device: Device;
  deviceHardware: DeviceHardware = new DeviceHardware(null);
  cpu: { name?: string, frequencyMax: number } = { name: '', frequencyMax: 0 };
  gpu: { name?: string, frequency: number } = { name: '', frequency: 0 };
  ram = { totalMemory: 0, type: '' };
  diskName = '';
  utilization: DeviceUtilization = new DeviceUtilization();

  constructor(private webSocket: WebsocketService,
              private hardwareService: HardwareService,
              private desktopDeviceService: DesktopDeviceService) {
    super();
    this.device = desktopDeviceService.activeDevice;
    this.update();
  }

  ngOnInit() {
    this.resourceNotifySubscription = this.webSocket.subscribe_notification('resource-usage')
      .pipe(filter(x => x.device_uuid === this.device.uuid))
      .subscribe(notification => this.updateUtilization(notification['data']));
  }

  ngOnDestroy() {
    this.resourceNotifySubscription.unsubscribe();
  }

  update() {
    this.hardwareService.getDeviceParts(this.device.uuid).subscribe(data => {
      this.deviceHardware = data;

      this.ram.totalMemory = data.getTotalMemory();
      this.ram.type = data.ram.length >= 1 ? data.ram[0].ramTyp.join(' ') : '';

      this.cpu = data.cpu[0];

      if (data.gpu.length >= 1) {
        this.gpu = data.gpu[0];
      } else if (data.cpu.length >= 1 && data.cpu[0].graphicUnit) {
        this.gpu = data.cpu[0].graphicUnit;
      } else if (data.mainboard.graphicUnitOnBoard) {
        this.gpu = data.mainboard.graphicUnitOnBoard;
      }

      this.diskName = data.disk.length >= 1 ? data.disk[0].name : 'Disk';

      this.webSocket.ms('device', ['hardware', 'resources'], { device_uuid: this.device.uuid })
        .subscribe(resourceData => this.updateUtilization(resourceData));
    });
  }

  updateUtilization(resourceUsage: any) {
    this.utilization.cpu = resourceUsage['cpu'];
    this.utilization.gpu = resourceUsage['gpu'];
    this.utilization.ram = resourceUsage['ram'] * this.ram.totalMemory;
    this.utilization.disk = resourceUsage['disk'];
    this.utilization.network = resourceUsage['network'];
  }

}

export class TaskManagerWindowDelegate extends WindowDelegate {
  title = 'Task-Manager';
  icon = '../../assets/desktop/img/task-manager.svg';
  type = TaskManagerComponent;

  constraints = new WindowConstraints({ minWidth: 400, minHeight: 350 });

  constructor() {
    super();
    this.position.height = 550;
  }
}
