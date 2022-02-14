import {Position} from '../../dataclasses/position';
import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Program} from '../../dataclasses/program';
import {ProgramService} from './program.service';
import {ActivatedRoute} from '@angular/router';
import {WindowManagerService} from './window-manager/window-manager.service';
import {GlobalCursorService} from '../global-cursor.service';
import {SettingsService} from './windows/settings/settings.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {DeviceService} from '../api/devices/device.service';
import {Device} from '../api/devices/device';
import {WindowManager} from './window-manager/window-manager';
import {availableBackgrounds} from '../../assets/desktop/backgrounds/backgrounds';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  activeDevice: Device;
  devices: Device[] = [];
  windowManager: WindowManager;
  startMenu = false;
  @ViewChild('surface', {static: true}) surface: ElementRef;
  linkages: Program[] = []; // array for all linkages on the desktop
  dragLinkageIndex: number; // index of current dragged element
  dragOffset: Position; // mouse offset position of the dragged element
  dragElement: HTMLElement;
  dragCursorLock: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private programService: ProgramService,
    private cursorService: GlobalCursorService,
    private settings: SettingsService,
    private sanitizer: DomSanitizer,
    private windowManagerService: WindowManagerService
  ) {
    this.activatedRoute.data.subscribe(data => {
      this.activeDevice = data['device'];
      this.windowManager = windowManagerService.forDevice(this.activeDevice);
      this.deviceService.getDevices().subscribe(response => {
        this.devices = response.devices;
      });
    });
  }

  ngOnInit(): void {
    this.linkages = this.programService.loadCached();
    this.programService.loadFresh().then(programs => this.linkages = programs);
    this.settings.backgroundImage.getFresh().then();
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
    const linkageClone: HTMLElement = linkageElement.cloneNode(true);
    linkageClone.id = 'dragLinkage';
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
          this.programService.save(this.linkages[this.dragLinkageIndex]);
        }
        this.dragElement.remove();
        this.dragElement = undefined!;
      }
      this.dragLinkageIndex = undefined!;
      this.dragOffset = undefined!;
      this.cursorService.releaseCursor(this.dragCursorLock);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(e: MouseEvent) {
    if (this.dragLinkageIndex !== undefined) {
      if (this.dragElement === undefined) {
        this.linkageDragStart();
      }
      const surfaceBounds = this.surface.nativeElement.getBoundingClientRect();
      const taskBarHeight = surfaceBounds.height * 0.055;
      this.dragElement.style.left =
        Math.min(Math.max(e.pageX - surfaceBounds.left - this.dragOffset.x, 0),
          surfaceBounds.width - this.dragElement.clientWidth) + 'px';
      this.dragElement.style.top =
        Math.min(Math.max(e.pageY - surfaceBounds.top - this.dragOffset.y, 0),
          surfaceBounds.height - this.dragElement.clientHeight - taskBarHeight) + 'px';
      if (!this.checkDropAllowed(e)) {
        this.dragElement.classList.add('not-allowed');
        this.dragCursorLock = this.cursorService.requestCursor('no-drop', this.dragCursorLock);
      } else {
        this.dragElement.classList.remove('not-allowed');
        this.cursorService.releaseCursor(this.dragCursorLock);
      }
    }
  }

  checkDropAllowed(e: MouseEvent): boolean {
    const elementsFromPoint = document['elementsFromPoint'] || document['msElementsFromPoint'];
    if (!elementsFromPoint) {
      return true;
    }

    const originalLinkage = this.surface.nativeElement.querySelectorAll('.linkage')[this.dragLinkageIndex];
    const mouseHoverElement: Element = (elementsFromPoint.bind(document)(e.pageX, e.pageY) || [])[1];
    return mouseHoverElement === this.surface.nativeElement || (originalLinkage !== null && mouseHoverElement === originalLinkage);
  }

  getBackground(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `black url(${availableBackgrounds[this.settings.backgroundImage.getCacheOrDefault()]}) bottom/cover no-repeat`
    );
  }

  trackByUUID(index: number, device: Device) {
    return device.uuid;
  }
}
