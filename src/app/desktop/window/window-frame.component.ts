import {Component, HostListener, Input, OnInit} from '@angular/core';
import {WindowManagerService} from '../window-manager/window-manager.service';
import {WindowPosition} from './window';

@Component({
  selector: 'app-window-frame',
  templateUrl: './window-frame.component.html',
  styleUrls: ['./window-frame.component.scss']
})
export class WindowFrameComponent implements OnInit {

  @Input() title: string;
  @Input() icon: string;
  @Input() position: WindowPosition;
  dragging = false;
  dragStartWindowPos: [number, number] = [0, 0];
  dragStart: [number, number] = [0, 0];
  resizing = false;
  resizeDirection = 0;
  resizeStartSize: [number, number] = [0, 0];
  cursor = 'auto';

  constructor(protected windowManager: WindowManagerService) {
  }

  ngOnInit() {
  }

  close() {
    this.windowManager.closeWindow(this.windowManager.windows.find(win => win.position === this.position));
  }

  startDragging(event: MouseEvent) {
    this.dragging = true;
    this.dragStart = [event.clientX, event.clientY];
    this.dragStartWindowPos = [this.position.x, this.position.y];
  }

  checkResizingStart(event: MouseEvent) {
    if (this.dragging || this.position.maximized) {
      return;
    }

    const top = event.offsetY < 10;
    const left = event.offsetX < 10;
    const bottom = event.offsetY > this.position.height - 10;
    const right = event.offsetX > this.position.width - 10;

    if (!(top || left || bottom || right)) {
      return;
    }

    this.resizing = true;
    this.resizeStartSize = [this.position.width, this.position.height];
    this.dragStart = [event.clientX, event.clientY];
    this.dragStartWindowPos = [this.position.x, this.position.y];

    if (top && left) {
      this.resizeDirection = 7;
    } else if (top && right) {
      this.resizeDirection = 8;
    } else if (bottom && left) {
      this.resizeDirection = 6;
    } else if (bottom && right) {
      this.resizeDirection = 5;
    } else if (top) {
      this.resizeDirection = 4;
    } else if (left) {
      this.resizeDirection = 3;
    } else if (bottom) {
      this.resizeDirection = 2;
    } else if (right) {
      this.resizeDirection = 1;
    }

  }

  checkResizeCursor(event: MouseEvent) {
    if (this.dragging || this.position.maximized || this.resizing) {
      return;
    }

    const top = event.offsetY < 10;
    const left = event.offsetX < 10;
    const bottom = event.offsetY > this.position.height - 10;
    const right = event.offsetX > this.position.width - 10;

    if ((top && left)) {
      this.cursor = 'nw-resize';
    } else if (top && right) {
      this.cursor = 'ne-resize';
    } else if (bottom && left) {
      this.cursor = 'sw-resize';
    } else if (bottom && right) {
      this.cursor = 'se-resize';
    } else if (top) {
      this.cursor = 'n-resize';
    } else if (left) {
      this.cursor = 'w-resize';
    } else if (bottom) {
      this.cursor = 's-resize';
    } else if (right) {
      this.cursor = 'e-resize';
    } else {
      this.cursor = 'auto';
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      if (this.dragging) {
        if (this.position.maximized) {
          this.dragStartWindowPos[0] = event.clientX - this.position.width / 2;
          this.dragStartWindowPos[1] = event.clientY - 15;
          this.position.maximized = false;
        }

        this.position.x = Math.min(Math.max(0, this.dragStartWindowPos[0] + event.clientX - this.dragStart[0]),
          window.innerWidth - this.position.width / 2);
        this.position.y = Math.min(Math.max(0, this.dragStartWindowPos[1] + event.clientY - this.dragStart[1]),
          window.innerHeight - this.position.height / 2);
      } else if (this.resizing) {
        /**
         *7  4  8
         *3     1
         *6  2  5
         */
        if (this.resizeDirection === 1 || this.resizeDirection === 5 || this.resizeDirection === 8) {
          console.log(this.resizeStartSize, this.position.width);
          this.position.width = Math.max(this.resizeStartSize[0] + event.clientX - this.dragStart[0], 300);
        }
        if (this.resizeDirection === 2 || this.resizeDirection === 5 || this.resizeDirection === 6) {
          this.position.height = Math.max(this.resizeStartSize[1] + event.clientY - this.dragStart[1], 150);
        }
        if (this.resizeDirection === 3 || this.resizeDirection === 6 || this.resizeDirection === 7) {
          const add = event.clientX - this.dragStart[0];
          this.position.x = Math.max(this.dragStartWindowPos[0] + add, 0);
          this.position.width = Math.max(this.resizeStartSize[0] - add, 300);
        }
        if (this.resizeDirection === 4 || this.resizeDirection === 7 || this.resizeDirection === 8) {
          const add = event.clientY - this.dragStart[1];
          this.position.y = Math.max(this.dragStartWindowPos[1] + add, 0);
          this.position.height = Math.max(this.resizeStartSize[1] - add, 150);
        }
      }
    }
  }

  minimize() {
    this.windowManager.unfocus();
    this.position.minimized = true;
  }

  maximize() {
    this.position.maximized = !this.position.maximized;
  }

}
