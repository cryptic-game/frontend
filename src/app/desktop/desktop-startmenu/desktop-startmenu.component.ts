import { Component, Input, OnInit } from '@angular/core';
import { DesktopComponent } from '../desktop.component';
import { WebsocketService } from 'src/app/websocket.service';
import { Router } from '@angular/router';
import { DesktopDeviceService } from '../desktop-device.service';
import { DeviceService } from '../../api/devices/device.service';
import { Device } from '../../api/devices/device';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  @Input() parent: DesktopComponent;
  @Input() target;

  devices: Device[] = [];

  searchTerm = '';

  constructor(public websocket: WebsocketService,
              private router: Router,
              public desktopDeviceService: DesktopDeviceService,
              private deviceService: DeviceService) {
    deviceService.getDevices().subscribe(response => {
      this.devices = response.devices;
    });
  }

  ngOnInit() {
  }

  search(term: string) {
    return this.parent.linkages.filter(item =>
      item.displayName
        .trim()
        .toLowerCase()
        .match(term.trim().toLowerCase())
    );
  }

  logout() {
    this.parent.windowManager.closeAllWindows();
    this.websocket.logout();
    this.router.navigate(['login']).then();
  }

  openBugReportPageGitHub() {
    window.open('https://github.com/cryptic-game/cryptic/issues/new/choose');
  }

  openBugReportPageForm() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSey6IZg-zJliAO4zNRmEdplqPkyqw-qmfKp4hARaBZHgNZSgQ/viewform');
  }
}
