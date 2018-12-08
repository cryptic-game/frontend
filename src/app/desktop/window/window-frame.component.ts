import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {WindowManagerService} from '../window-manager/window-manager.service';
import {WindowPosition} from './window';

@Component({
  selector: 'app-window-frame',
  templateUrl: './window-frame.component.html',
  styleUrls: ['./window-frame.component.scss']
})
export class WindowFrameComponent implements OnInit {

  @ViewChild('window') windowDiv;

  @Input() title: string;
  @Input() icon: string;
  @Input() position: WindowPosition;
  dragging = false;
  dragStartPos: [number, number] = [0, 0];
  dragStart: [number, number] = [0, 0];

  constructor(protected windowManager: WindowManagerService) { }

  ngOnInit() {
  }

  close() {
    this.windowManager.closeWindow(this.windowManager.windows.find(win => win.position === this.position));
  }

  startDragging(event: MouseEvent) {
    this.dragging = true;
    this.dragStart = [event.clientX, event.clientY];
    this.dragStartPos = [this.position.x, this.position.y];
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    if (!this.dragging || event.buttons !== 1) {
      return;
    }
    if (this.position.maximized) {
      this.dragStartPos[0] = event.clientX - this.position.width / 2;
      this.dragStartPos[1] = event.clientY - 15;
      this.position.maximized = false;
    }

    this.position.x = Math.min(Math.max(0, this.dragStartPos[0] + event.clientX - this.dragStart[0]),
      window.innerWidth - this.position.width / 2);
    this.position.y = Math.min(Math.max(0, this.dragStartPos[1] + event.clientY - this.dragStart[1]),
      window.innerHeight - this.position.height / 2);
  }

  minimize() {
    this.windowManager.unfocus();
    this.position.minimized = true;
  }

  maximize() {
    this.position.maximized = !this.position.maximized;
  }

}
