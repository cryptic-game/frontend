import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {WebsocketService} from '../../websocket.service';
import {DeviceService} from '../../api/devices/device.service';
import {from} from 'rxjs';
import {filter, flatMap, map, switchMap, toArray} from 'rxjs/operators';
import {Device, DeviceResources, ResourceUsage} from '../../api/devices/device';
import {animate, animateChild, keyframes, query, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {DeviceHardware} from '../../api/hardware/device-hardware';
import {ControlCenterService} from '../control-center.service';


function powerButtonColorAnimation(triggerName, property) {
  return trigger(triggerName, [
    state('off', style({[property]: '#D41C1C'})),
    state('fast-off', style({[property]: '#D41C1C'})),
    state('on', style({[property]: '#1BD41F'})),
    state('fast-on', style({[property]: '#1BD41F'})),
    transition('* => on', [
      animate('20s', keyframes([
        style({[property]: '#D41C1C', 'offset': 0.0}),
        style({[property]: '#d4691e', 'offset': 0.3}),
        style({[property]: '#1BD41F', 'offset': 1.0})
      ]))
    ]),
    transition('* => off', [
      animate('30s', keyframes([
        style({[property]: '#1BD41F', 'offset': 0.0}),
        style({[property]: '#d4691e', 'offset': 0.3}),
        style({[property]: '#D41C1C', 'offset': 1.0})
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
      state('off', style({'stroke-dashoffset': '2224.24759874'})),
      state('fast-off', style({'stroke-dashoffset': '2224.24759874'})),
      state('on', style({'stroke-dashoffset': '0'})),
      state('fast-on', style({'stroke-dashoffset': '0'})),
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
export class ControlCenterDevicePageComponent implements OnDestroy {
  device: Device;
  hardware: DeviceHardware;
  deviceResources: DeviceResources;
  services: {
    service: { uuid: string; name: string; running: boolean };
    usage: ResourceUsage;
  }[] = [];
  powerButton: {
    state: 'off' | 'fast-off' | 'on' | 'fast-on';
    animating: boolean;
  } = {
    state: 'fast-off',
    animating: false
  };
  disassembleModal = false;
  disassembleConfirmed = false;
  renamingActive = false;
  nameChanged = false;

  @ViewChild('deviceRename') deviceRenameField: ElementRef<HTMLElement>;

  constructor(private webSocket: WebsocketService,
              private deviceService: DeviceService,
              private activatedRoute: ActivatedRoute,
              private controlCenterService: ControlCenterService,
              private router: Router) {
    this.activatedRoute.data.subscribe(data => {
      this.hardware = data['hardware'];
      this.device = this.hardware.device;
      this.powerButton.animating = false;
      this.closeDisassembleModal();
      this.stopRenaming();
      this.updateServices();
    });
  }

  ngOnDestroy() {
    this.powerButton.animating = false;
  }

  updateServices(): void {
    this.powerButton.state = this.device.powered_on ? 'fast-on' : 'fast-off';
    if (this.device.powered_on) {
      this.deviceService.getDeviceResourceUsage(this.device.uuid).subscribe(resources => {
        this.deviceResources = resources;

        this.webSocket.ms('service', ['list'], {device_uuid: this.device.uuid}).pipe(
          switchMap(response => from(response.services as { uuid: string; name: string; running: boolean }[])),
          filter(service => service.running),
          flatMap(service =>
            this.deviceService.getServiceResourceUsage(service.uuid).pipe(map(serviceUsage =>
              ({service: service, usage: new ResourceUsage(serviceUsage).relativeToDevice(this.deviceResources)})
            ))),
          toArray(),
          map(serviceUsages => serviceUsages.sort((a, b) => a.service.name.localeCompare(b.service.name)))
        ).subscribe(serviceUsages => {
          this.services.length = 0;
          this.services.push(...serviceUsages);
        });
      });
    } else {
      this.services = [];
    }
  }

  deviceNameKeyPress(event: KeyboardEvent): void {
    // This event is deprecated, but the beforeinput event isn't available in Firefox yet
    // and keydown apparently can't block characters after dead accents. Also, we would
    // have to explicitly allow everything

    const nameLength = this.deviceRenameField.nativeElement.innerText.length;

    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && nameLength >= 1) {
      event.preventDefault();
      this.finishRenaming();
    } else if (event.key.match(/^[a-zA-Z0-9\-_]$/) == null || nameLength >= 15) {
      event.preventDefault();
    }
  }

  deviceNameInput(): void {
    this.nameChanged = this.deviceRenameField.nativeElement.innerText !== this.device.name;
  }

  startRenaming(): void {
    this.renamingActive = true;
    this.nameChanged = false;
    this.deviceRenameField.nativeElement.innerText = this.device.name;
    this.deviceRenameField.nativeElement.hidden = false;
    this.deviceRenameField.nativeElement.contentEditable = 'true';
    this.deviceRenameField.nativeElement.focus();
  }

  finishRenaming(): void {
    if (!this.renamingActive) {
      return;
    }
    if (!this.nameChanged) {
      this.stopRenaming();
      return;
    }

    const newName = this.deviceRenameField.nativeElement.innerText
      .replace(/[^a-zA-Z0-9\-_]+/g, '')
      .substr(0, 15);
    if (newName.length === 0) {
      this.stopRenaming();
      return;
    }

    this.device.name = newName;

    this.deviceService.renameDevice(this.device.uuid, newName).subscribe(() => {
      this.controlCenterService.refreshDevices().subscribe();
    });

    this.stopRenaming();
  }

  stopRenaming() {
    this.renamingActive = false;
    this.nameChanged = false;
    if (this.deviceRenameField) {
      this.deviceRenameField.nativeElement.contentEditable = 'false';
      this.deviceRenameField.nativeElement.hidden = true;
    }
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

  closeDisassembleModal() {
    this.disassembleConfirmed = false;
    this.disassembleModal = false;
  }

  checkDisassembleConfirm(input: HTMLInputElement) {
    this.disassembleConfirmed = input.value === this.device.name;
  }

  disassembleDevice() {
    this.deviceService.deleteDevice(this.device.uuid).subscribe(() => {
      this.controlCenterService.refreshDevices().subscribe();
      this.router.navigateByUrl('/').then();
    });
    this.closeDisassembleModal();
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeDisassembleModal();
    }
  }
}
