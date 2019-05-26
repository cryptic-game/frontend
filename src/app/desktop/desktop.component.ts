import { Position } from '../../dataclasses/position';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../dataclasses/program';
import { ProgramService } from './program.service';
import { Router } from '@angular/router';
import { WindowManagerService } from './window-manager/window-manager.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  startMenu = false;
  contextMenu = false;
  contextMenuPosition = new Position(0, 0);
  contextMenuTarget: EventTarget;
  @ViewChild('surface')
  surface: ElementRef;
  linkages: Program[] = []; // array for all linkages on the desktop
  index: number; // index of the dragged element
  position: Position; // position of the dragged element

  token: string = localStorage.getItem('token');
  username: string = sessionStorage.getItem('username');

  constructor(
    private router: Router,
    private websocket: WebsocketService,
    private programService: ProgramService,
    public windowManager: WindowManagerService,
  ) {
  }

  ngOnInit(): void {
    this.linkages = this.programService.list();

    this.initSession();
  }

  initSession(): void {
    this.websocket.request({
      action: 'info'
    }).subscribe(response => {
      sessionStorage.setItem('username', response.name);
      this.username = response.name;
      sessionStorage.setItem('email', response.mail);
      sessionStorage.setItem('created', response.created);
      sessionStorage.setItem('last', response.last);
      this.websocket.ms('device', ['device', 'all'], {}).subscribe(r => {
        let devices = r.devices;

        if (devices == null || devices.length === 0) {
          this.websocket.ms('device', ['device', 'create'], {}).subscribe(r2 => {
            devices = [r2];
            sessionStorage.setItem('devices', JSON.stringify(devices));
            sessionStorage.setItem('activeDevice', JSON.stringify(devices[0]));

            // just to make the pre-alpha 1.0 full of action
            this.websocket.ms('service', ['create'], { name: 'ssh', device_uuid: devices[0]['uuid'] });
          });
        } else {
          sessionStorage.setItem('devices', JSON.stringify(devices));
          sessionStorage.setItem('activeDevice', JSON.stringify(devices[0]));
        }
      });
    });
  }

  onDesktop(): Program[] {
    return this.linkages.filter(item => item.onDesktop);
  }

  toggleStartMenu(): void {
    this.startMenu = !this.startMenu;
  }

  hideStartMenu(): void {
    this.startMenu = false;
  }

  showContextMenu(e: MouseEvent): boolean {
    this.contextMenuPosition = new Position(e.pageX, e.pageY);
    this.contextMenuTarget = e.target;
    this.contextMenu = true;

    this.mouseup();

    return false;
  }

  hideContextMenu(): void {
    this.contextMenu = false;
  }

  openProgramWindow(program: Program): void {
    this.windowManager.openWindow(program.newWindow());
  }

  checkWindowUnfocus(event: MouseEvent): void {
    if ((event.target as Element) === this.surface.nativeElement) {
      this.windowManager.unfocus();
    }
  }

  mousedown(e: MouseEvent, i: number): void {
    this.index = i;
    this.position = new Position(e.offsetX, e.offsetY);

    this.linkages.forEach(el => {
      el.position.z = 0;
    });
    this.linkages[this.index].position.z = 1;
  }

  mouseup(): void {
    if (this.index !== undefined) {
      this.programService.update();
    }

    this.index = undefined;
    this.position = undefined;
  }

  mousemove(e: MouseEvent): void {
    if (this.index !== undefined) {
      this.linkages[this.index].position.x = e.pageX - this.position.x;
      this.linkages[this.index].position.y = e.pageY - this.position.y;
    }
  }
}
