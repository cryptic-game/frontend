import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HardwareService } from '../../../api/hardware/hardware.service';
import { DeviceResources, ResourceUsage } from '../../../api/devices/device';
import { DeviceHardware } from '../../../api/hardware/device-hardware';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
})
export class TaskManagerComponent extends WindowComponent implements OnInit, OnDestroy {
  resourceNotifySubscription: Subscription;

  deviceHardware: DeviceHardware;
  cpu: { name?: string; frequencyMax: number } = { name: '', frequencyMax: 0 };
  gpu: { name?: string; frequency: number } = { name: '', frequency: 0 };
  ram = { totalMemory: 0, type: '' };
  diskName = '';
  utilization: ResourceUsage = new ResourceUsage();

  constructor(
    public override delegate: WindowDelegate,
    private webSocket: WebsocketService,
    private hardwareService: HardwareService
  ) {
    super();
    this.deviceHardware = new DeviceHardware(delegate.device);
    this.update();
  }

  ngOnInit() {
    this.resourceNotifySubscription = this.webSocket
      .subscribeNotification<ResourceUsage>('resource-usage')
      .pipe(filter((x) => x.device_uuid === this.delegate.device.uuid))
      .subscribe((notification) => this.updateUtilization(notification['data'], true));
  }

  ngOnDestroy() {
    this.resourceNotifySubscription.unsubscribe();
  }

  update() {
    this.hardwareService.getDeviceParts(this.delegate.device.uuid).subscribe((data) => {
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

      this.diskName = data.disk.length >= 1 ? data.disk[0].name! : 'Disk';

      this.webSocket
        .ms('device', ['hardware', 'resources'], { device_uuid: this.delegate.device.uuid })
        .subscribe((resourceData) => this.updateUtilization(resourceData, false));
    });
  }

  updateUtilization(resourceUsage: any, notification: boolean) {
    Object.assign(this.utilization, notification ? resourceUsage : new DeviceResources(resourceUsage).relativeUsage());
  }
}

export class TaskManagerWindowDelegate extends WindowDelegate {
  title = 'Task-Manager';
  icon = 'assets/desktop/img/task-manager.svg';
  type = TaskManagerComponent;

  override constraints = new WindowConstraints({ minWidth: 400, minHeight: 350 });

  constructor() {
    super();
    this.position.height = 550;
  }
}
