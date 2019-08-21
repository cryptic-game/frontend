import { Position } from '../../dataclasses/position';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../dataclasses/program';
import { ProgramService } from './program.service';
import { Router } from '@angular/router';
import { WindowManagerService } from './window-manager/window-manager.service';
import { WebsocketService } from '../websocket.service';
import { GlobalCursorService } from '../global-cursor.service';

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
  @ViewChild('surface', { static: true }) surface: ElementRef;
  linkages: Program[] = []; // array for all linkages on the desktop
  dragLinkageIndex: number; // index of current dragged element
  dragOffset: Position; // mouse offset position of the dragged element
  dragElement: HTMLElement;
  dragCursorLock: number;

  token: string = localStorage.getItem('token');
  username: string = sessionStorage.getItem('username');

  constructor(
    private router: Router,
    private websocket: WebsocketService,
    private programService: ProgramService,
    private cursorService: GlobalCursorService,
    public windowManager: WindowManagerService
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
          this.websocket.ms('device', ['device', 'starter_device'], {}).subscribe(r2 => {
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

  linkageMouseDown(e: MouseEvent, i: number) {
    this.dragLinkageIndex = i;
    this.dragOffset = new Position(e.offsetX, e.offsetY);
  }

  linkageDragStart() {
    const linkageElement = this.surface.nativeElement.querySelectorAll('.linkage')[this.dragLinkageIndex];
    const linkageClone = linkageElement.cloneNode(true);
    linkageClone.style.zIndex = '10';
    this.surface.nativeElement.appendChild(linkageClone);
    this.dragElement = linkageClone;
    this.linkages.forEach(el => {
      el.position.z = 0;
    });
    this.linkages[this.dragLinkageIndex].position.z = 1;
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(e: MouseEvent): void {
    if (this.dragLinkageIndex !== undefined) {
      if (this.dragElement !== undefined) {
        if (this.checkDropAllowed(e)) {
          this.linkages[this.dragLinkageIndex].position.x = this.dragElement.offsetLeft;
          this.linkages[this.dragLinkageIndex].position.y = this.dragElement.offsetTop;
          this.programService.update();
        }
        this.dragElement.remove();
        this.dragElement = undefined;
      }
      this.dragLinkageIndex = undefined;
      this.dragOffset = undefined;
      this.cursorService.releaseCursor(this.dragCursorLock);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(e: MouseEvent) {
    if (this.dragLinkageIndex !== undefined) {
      if (this.dragElement === undefined) {
        this.linkageDragStart();
      } else {
        const bounding = this.surface.nativeElement.getBoundingClientRect();
        const taskBarHeight = bounding.height * 0.055;
        this.dragElement.style.left =
          Math.min(Math.max(e.pageX - this.dragOffset.x, bounding.left),
            bounding.right - this.dragElement.clientWidth) + 'px';
        this.dragElement.style.top =
          Math.min(Math.max(e.pageY - this.dragOffset.y, bounding.top),
            bounding.bottom - this.dragElement.clientHeight - taskBarHeight) + 'px';
        if (!this.checkDropAllowed(e)) {
          this.dragElement.style.backgroundColor = 'rgba(50, 0, 0, 100)';
          this.dragCursorLock = this.cursorService.requestCursor('no-drop', this.dragCursorLock);
        } else {
          this.dragElement.style.backgroundColor = '';
          this.cursorService.releaseCursor(this.dragCursorLock);
        }
      }
    }
  }

  checkDropAllowed(e: MouseEvent): boolean {
    const elementsFromPoint = document['elementsFromPoint'] || document['msElementsFromPoint'];
    if (!elementsFromPoint) {
      return true;
    }
    return (elementsFromPoint.bind(document)(e.pageX, e.pageY) || [])[1] === this.surface.nativeElement;
  }

}
