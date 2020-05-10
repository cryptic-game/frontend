import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { DeviceService } from '../../api/devices/device.service';
import { from } from 'rxjs';
import { filter, flatMap, map, switchMap, toArray } from 'rxjs/operators';
import { Device, DeviceUtilization } from '../../api/devices/device';
import { animate, animateChild, keyframes, query, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { ControlCenterService } from '../control-center.service';
import { DeviceHardware } from '../../api/hardware/hardware.service';


function powerButtonColorAnimation(triggerName, property) {
  return trigger(triggerName, [
    state('0', style({ [property]: '#D41C1C' })),
    state('1', style({ [property]: '#1BD41F' })),
    transition('0 => 1', [
      animate('20s', keyframes([
        style({ [property]: '#D41C1C', 'offset': 0.0 }),
        style({ [property]: '#d4691e', 'offset': 0.3 }),
        style({ [property]: '#1BD41F', 'offset': 1.0 })
      ]))
    ]),
    transition('1 => 0', [
      animate('30s', keyframes([
        style({ [property]: '#1BD41F', 'offset': 0.0 }),
        style({ [property]: '#d4691e', 'offset': 0.3 }),
        style({ [property]: '#D41C1C', 'offset': 1.0 })
      ]))
    ]),
  ]);
}


@Component({
  selector: 'app-control-center-device-page',
  animations: [
    trigger('powerButton', [
      transition('0 <=> 1', [
        query('@powerButtonFill, @powerButtonStroke, @powerButtonProgress', [
          animateChild()
        ])
      ])
    ]),
    powerButtonColorAnimation('powerButtonFill', 'fill'),
    powerButtonColorAnimation('powerButtonStroke', 'stroke'),
    trigger('powerButtonProgress', [
      state('0', style({
        'stroke-dashoffset': '2224.24759874'
      })),
      state('1', style({
        'stroke-dashoffset': '0'
      })),
      transition('0 => 1', [
        animate('20s')
      ]),
      transition('1 => 0', [
        animate('30s')
      ])
    ])
  ],
  templateUrl: './control-center-device-page.component.html',
  styleUrls: ['./control-center-device-page.component.scss']
})
export class ControlCenterDevicePageComponent implements OnInit {
  device: Device;
  hardware: DeviceHardware;
  services: {
    service: { uuid: string, name: string, running: boolean },
    usage: DeviceUtilization
  }[] = [];
  powerButton = {
    power: false,
    animating: false
  };

  @ViewChild('deviceName') deviceNameField;

  constructor(private webSocket: WebsocketService,
              private deviceService: DeviceService,
              private controlCenterService: ControlCenterService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParamMap.subscribe(queryParamMap => {
      this.device = this.controlCenterService.getDevice(queryParamMap.get('device'));
      this.updateServices();
    });
    this.activatedRoute.data.subscribe(data => {
      this.hardware = data['hardware'];
    });
  }

  ngOnInit(): void {
  }

  updateServices(): void {
    this.powerButton.power = this.device.powered_on;
    if (this.device.powered_on) {
      this.webSocket.ms('service', ['list'], { device_uuid: this.device.uuid }).pipe(
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

  deviceNameKeyPressed(event: KeyboardEvent): boolean {
    const nameLength = this.deviceNameField.nativeElement.innerText.length;
    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && nameLength >= 1) {
      const newName = this.deviceNameField.nativeElement.innerText
        .replace(/[^a-zA-Z0-9\-_]+/g, '')
        .substr(0, 15);
      this.deviceService.renameDevice(this.device.uuid, newName).subscribe(response => {
        this.device.name = response['name'];
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

  powerButtonClicked() {
    if (!this.powerButton.animating) {
      this.powerButton.power = !this.powerButton.power;

      setTimeout(this.togglePower.bind(this), this.powerButton.power ? 20000 : 30000);
    }
  }

  togglePower() {
    this.deviceService.togglePower(this.device.uuid).subscribe(device => {
      Object.assign(this.device, device);
      this.updateServices();
    });
  }
}
