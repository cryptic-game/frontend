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
    state('off', style({ [property]: '#D41C1C' })),
    state('fast-off', style({ [property]: '#D41C1C' })),
    state('on', style({ [property]: '#1BD41F' })),
    state('fast-on', style({ [property]: '#1BD41F' })),
    transition('* => on', [
      animate('20s', keyframes([
        style({ [property]: '#D41C1C', 'offset': 0.0 }),
        style({ [property]: '#d4691e', 'offset': 0.3 }),
        style({ [property]: '#1BD41F', 'offset': 1.0 })
      ]))
    ]),
    transition('* => off', [
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
      transition('* <=> *', [
        query('@powerButtonFill, @powerButtonStroke, @powerButtonProgress', [
          animateChild()
        ])
      ])
    ]),
    powerButtonColorAnimation('powerButtonFill', 'fill'),
    powerButtonColorAnimation('powerButtonStroke', 'stroke'),
    trigger('powerButtonProgress', [
      state('off', style({ 'stroke-dashoffset': '2224.24759874' })),
      state('fast-off', style({ 'stroke-dashoffset': '2224.24759874' })),
      state('on', style({ 'stroke-dashoffset': '0' })),
      state('fast-on', style({ 'stroke-dashoffset': '0' })),
      transition('* => on', [
        animate('20s')
      ]),
      transition('* => off', [
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
  powerButton: {
    state: 'off' | 'fast-off' | 'on' | 'fast-on';
    animating: boolean;
  } = {
    state: 'fast-off',
    animating: false
  };

  @ViewChild('deviceName') deviceNameField;

  constructor(private webSocket: WebsocketService,
              private deviceService: DeviceService,
              private controlCenterService: ControlCenterService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe(data => {
      this.hardware = data['hardware'];
      this.device = this.hardware.device;
      this.powerButton.animating = false;
      this.updateServices();
    });
  }

  ngOnInit(): void {
  }

  updateServices(): void {
    this.powerButton.state = this.device.powered_on ? 'fast-on' : 'fast-off';
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
      this.powerButton.animating = true;
      this.powerButton.state =
        (this.powerButton.state === 'fast-off' || this.powerButton.state === 'off') ? 'on' : 'off';
    }
  }

  powerAnimationDone() {
    if (this.powerButton.animating) {
      this.powerButton.animating = false;
      this.deviceService.togglePower(this.device.uuid).subscribe(device => {
        Object.assign(this.device, device);
        this.updateServices();
      });
    }
  }
}
