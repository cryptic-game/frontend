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
  ramTotal = 0;
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
    console.log(this.webSocket);
  }

  ngOnDestroy() {
    this.resourceNotifySubscription.unsubscribe();
  }

  update() {
    this.hardwareService.getDeviceParts(this.deviceUUID).subscribe(data => {
      this.deviceHardware = data;
      this.ramTotal = data.ram.reduce((previousValue, currentValue) => previousValue + currentValue.ramSize, 0);

      this.webSocket.ms('device', ['hardware', 'resources'], { device_uuid: this.deviceUUID })
        .subscribe(resourceData => this.updateUtilization(resourceData));
    });
  }

  updateUtilization(resourceUsage: any) {
    this.utilization.cpu = resourceUsage['cpu'];
    this.utilization.gpu = resourceUsage['gpu'];
    this.utilization.ram = resourceUsage['ram'] * this.ramTotal;
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
