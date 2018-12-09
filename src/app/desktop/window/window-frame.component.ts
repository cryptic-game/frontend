import {Component, HostListener, Input, OnInit} from '@angular/core';
import {WindowManagerService} from '../window-manager/window-manager.service';
import {WindowPosition} from './window';

@Component({
  selector: 'app-window-frame',
  templateUrl: './window-frame.component.html',
  styleUrls: ['./window-frame.component.scss']
})
export class WindowFrameComponent implements OnInit {
  static minWidth = 300;
  static minHeight = 150;

  @Input() title: string;
  @Input() icon: string;
  @Input() position: WindowPosition;
  dragging = false;
  dragStartWindowPos: [number, number] = [0, 0];
  dragStartPos: [number, number] = [0, 0];
  resizing = false;
  resizeDirection = 0;
  resizeStartSize: [number, number] = [0, 0];

  constructor(public windowManager: WindowManagerService) {
  }

  ngOnInit() {
  }

  close() {
    this.windowManager.closeWindow(this.windowManager.windows.find(win => win.position === this.position));
  }

  startDragging(event: MouseEvent) {
    this.dragging = true;
    this.dragStartPos = [event.clientX, event.clientY];
    this.dragStartWindowPos = [this.position.x, this.position.y];
  }

  checkResizeDirection(clientX, clientY, target: Element) {
    if (this.dragging || this.position.maximized || this.resizing) {
      return 0;
    }

    if (!(target.id === 'desktop-surface' || (target.closest('app-window-frame') && window.document.defaultView
      .getComputedStyle(target.closest('app-window-frame')).zIndex === this.position.zIndex.toString()))) {
      return 0;
    }

    const offsetX = clientX - this.position.x;
    const offsetY = clientY - this.position.y;

    if (offsetX < -5 || offsetY < -5 || offsetX > this.position.width + 7 || offsetY > this.position.height + 7) {
      return 0;
    }

    const absOffsetX = Math.abs(offsetX);
    // noinspection JSSuspiciousNameCombination
    const absOffsetY = Math.abs(offsetY);

    const top = absOffsetY < 5;
    const left = absOffsetX < 5;
    const bottom = absOffsetY > this.position.height - 5;
    const right = absOffsetX > this.position.width - 5;

    if (!(top || left || bottom || right)) {
      return 0;
    }

    return (top && left) ? 7
      : (top && right) ? 8
        : (bottom && left) ? 6
          : (bottom && right) ? 5
            : top ? 4
              : left ? 3
                : bottom ? 2
                  : right ? 1
                    : 0;
  }

  @HostListener('document:mousedown', ['$event'])
  checkResizingStart(event: MouseEvent) {
    this.resizeDirection = this.checkResizeDirection(event.clientX, event.clientY, event.toElement);
    if (this.resizeDirection !== 0) {
      this.resizing = true;
      this.dragStartWindowPos = [this.position.x, this.position.y];
      this.dragStartPos = [event.clientX, event.clientY];
      this.resizeStartSize = [this.position.width, this.position.height];
      this.windowManager.focusWindow(this.windowManager.findWindow(this.position));
    }
  }

  checkResizeCursor(event: MouseEvent) {
    if (this.resizing) {
      return;
    }

    const direction = this.checkResizeDirection(event.clientX, event.clientY, event.toElement);

    this.setCursor({
      7: 'nw-resize',
      8: 'ne-resize',
      6: 'sw-resize',
      5: 'se-resize',
      4: 'n-resize',
      3: 'w-resize',
      2: 's-resize',
      1: 'e-resize',
      0: ''
    }[direction]);
  }

  setCursor(cursor) {
    this.windowManager.setCursor(this.windowManager.findWindow(this.position), cursor);
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.checkResizeCursor(event);
    if (event.buttons === 1) {
      if (this.dragging) {
        if (this.position.maximized) {
          this.dragStartWindowPos[0] = event.clientX - this.position.width / 2;
          this.dragStartWindowPos[1] = event.clientY - 15;
          this.position.maximized = false;
        }

        this.position.x = Math.min(Math.max(0, this.dragStartWindowPos[0] + event.clientX - this.dragStartPos[0]),
          window.innerWidth - this.position.width / 2);
        this.position.y = Math.min(Math.max(0, this.dragStartWindowPos[1] + event.clientY - this.dragStartPos[1]),
          window.innerHeight - this.position.height / 2);
      } else if (this.resizing) {
        /**
         *7  4  8
         *3     1
         *6  2  5
         */
        if (this.resizeDirection === 1 || this.resizeDirection === 5 || this.resizeDirection === 8) {
          this.position.width = Math.max(this.resizeStartSize[0] + event.clientX - this.dragStartPos[0], WindowFrameComponent.minWidth);
        }
        if (this.resizeDirection === 2 || this.resizeDirection === 5 || this.resizeDirection === 6) {
          this.position.height = Math.max(this.resizeStartSize[1] + event.clientY - this.dragStartPos[1], WindowFrameComponent.minHeight);
        }
        if (this.resizeDirection === 3 || this.resizeDirection === 6 || this.resizeDirection === 7) {
          const add = event.clientX - this.dragStartPos[0];
          this.position.x = Math.min(Math.max(this.dragStartWindowPos[0] + add, 0),
            this.dragStartWindowPos[0] + this.resizeStartSize[0] - WindowFrameComponent.minWidth);
          this.position.width = Math.max(this.resizeStartSize[0] - add, WindowFrameComponent.minWidth);
        }
        if (this.resizeDirection === 4 || this.resizeDirection === 7 || this.resizeDirection === 8) {
          const add = event.clientY - this.dragStartPos[1];
          this.position.y = Math.min(Math.max(this.dragStartWindowPos[1] + add, 0),
            this.dragStartWindowPos[1] + this.resizeStartSize[1] - WindowFrameComponent.minHeight);
          this.position.height = Math.max(this.resizeStartSize[1] - add, WindowFrameComponent.minHeight);
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
