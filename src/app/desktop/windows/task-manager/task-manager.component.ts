import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DeviceHardware, HardwareService } from '../../../hardware/hardware.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent extends WindowComponent implements OnInit, OnDestroy {
  deviceUUID: string;
  resourceNotifySubscription: Subscription;

  deviceName: string;
  deviceHardware: DeviceHardware = new DeviceHardware();
  cpu: { name?: string, frequencyMax: number } = { name: '', frequencyMax: 0 };
  gpu: { name?: string, frequency: number } = { name: '', frequency: 0 };
  ram = { totalMemory: 0, type: '' };
  diskName = '';
  utilization: Utilization = new Utilization();

  constructor(private webSocket: WebsocketService, private hardwareService: HardwareService) {
    super();
    const device = JSON.parse(sessionStorage.getItem('activeDevice'));
    this.deviceName = device['name'];
    this.deviceUUID = device['uuid'];
    this.update();
  }

  ngOnInit() {
    this.resourceNotifySubscription = this.webSocket.register_notification('resource-usage')
      .pipe(filter(x => x.device_uuid === this.deviceUUID))
      .subscribe(notification => this.updateUtilization(notification['data']));
  }

  ngOnDestroy() {
    this.resourceNotifySubscription.unsubscribe();
  }

  update() {
    this.hardwareService.getDeviceParts(this.deviceUUID).subscribe(data => {
      this.deviceHardware = data;

      this.ram.totalMemory = data.ram.reduce((previousValue, currentValue) => previousValue + currentValue.ramSize, 0);
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

      this.webSocket.ms('device', ['hardware', 'resources'], { device_uuid: this.deviceUUID })
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

  constructor() {
    super();
    this.position.height = 500;
  }
}

class Utilization {
  cpu = 0;
  gpu = 0;
  ram = 0;
  disk = 0;
  network = 0;
  // temperature = 0;  // later
}
