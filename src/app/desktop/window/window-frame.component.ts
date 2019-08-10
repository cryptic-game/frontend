import { Component, ComponentFactoryResolver, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { WindowManagerService } from '../window-manager/window-manager.service';
import { WindowDelegate } from './window-delegate';
import { WindowPlaceDirective } from './window-place.directive';

@Component({
  selector: 'app-window-frame',
  templateUrl: './window-frame.component.html',
  styleUrls: ['./window-frame.component.scss']
})
export class WindowFrameComponent implements OnInit {
  static minWidth = 300;
  static minHeight = 150;

  @ViewChild(WindowPlaceDirective, { static: true }) windowPlace: WindowPlaceDirective;

  @Input() delegate: WindowDelegate;
  dragging = false;
  dragStartWindowPos: [number, number] = [0, 0];
  dragStartPos: [number, number] = [0, 0];
  resizing = false;
  resizeDirection = 0;
  resizeStartSize: [number, number] = [0, 0];

  constructor(public windowManager: WindowManagerService, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.loadWindowContent();
  }

  loadWindowContent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.delegate.type);
    const componentRef = this.windowPlace.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.delegate = this.delegate;
    this.delegate.component = componentRef.instance;
  }

  close() {
    this.windowManager.closeWindow(this.delegate);
  }

  startDragging(event: MouseEvent) {
    this.dragging = true;
    this.dragStartPos = [event.clientX, event.clientY];
    this.dragStartWindowPos = [this.delegate.position.x, this.delegate.position.y];
  }

  checkResizeDirection(clientX, clientY, target: Element) {
    if (target === undefined) {
      return 0;
    }

    if (this.dragging || this.delegate.position.maximized || this.resizing) {
      return 0;
    }

    if (!(target.id === 'desktop-surface' || (target.closest('app-window-frame') && window.document.defaultView
      .getComputedStyle(target.closest('app-window-frame')).zIndex === this.delegate.position.zIndex.toString()))) {
      return 0;
    }

    const offsetX = clientX - this.delegate.position.x;
    const offsetY = clientY - this.delegate.position.y;

    if (offsetX < -5 || offsetY < -5 || offsetX > this.delegate.position.width + 7 || offsetY > this.delegate.position.height + 7) {
      return 0;
    }

    const absOffsetX = Math.abs(offsetX);
    // noinspection JSSuspiciousNameCombination
    const absOffsetY = Math.abs(offsetY);

    const top = absOffsetY < 5;
    const left = absOffsetX < 5;
    const bottom = absOffsetY > this.delegate.position.height - 5;
    const right = absOffsetX > this.delegate.position.width - 5;

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
    this.resizeDirection = this.checkResizeDirection(event.clientX, event.clientY, event.target as Element);
    if (this.resizeDirection !== 0) {
      this.resizing = true;
      this.dragStartWindowPos = [this.delegate.position.x, this.delegate.position.y];
      this.dragStartPos = [event.clientX, event.clientY];
      this.resizeStartSize = [this.delegate.position.width, this.delegate.position.height];
      this.windowManager.focusWindow(this.delegate);
    }
  }

  checkResizeCursor(event: MouseEvent) {
    if (this.resizing) {
      return;
    }

    const direction = this.checkResizeDirection(event.clientX, event.clientY, event.target as Element);

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
    this.windowManager.setCursor(this.delegate, cursor);
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.checkResizeCursor(event);
    if (event.buttons === 1) {
      if (this.dragging) {
        if (this.delegate.position.maximized) {
          this.dragStartWindowPos[0] = event.clientX - this.delegate.position.width / 2;
          this.dragStartWindowPos[1] = event.clientY - 15;
          this.delegate.position.maximized = false;
        }

        this.delegate.position.x = Math.min(Math.max(0, this.dragStartWindowPos[0] + event.clientX - this.dragStartPos[0]),
          window.innerWidth - this.delegate.position.width / 2);
        this.delegate.position.y = Math.min(Math.max(0, this.dragStartWindowPos[1] + event.clientY - this.dragStartPos[1]),
          window.innerHeight - this.delegate.position.height / 2);
      } else if (this.resizing) {
        /**
         *7  4  8
         *3     1
         *6  2  5
         */
        if (this.resizeDirection === 1 || this.resizeDirection === 5 || this.resizeDirection === 8) {
          this.delegate.position.width = Math.max(this.resizeStartSize[0] + event.clientX - this.dragStartPos[0],
            WindowFrameComponent.minWidth);
        }
        if (this.resizeDirection === 2 || this.resizeDirection === 5 || this.resizeDirection === 6) {
          this.delegate.position.height = Math.max(this.resizeStartSize[1] + event.clientY - this.dragStartPos[1],
            WindowFrameComponent.minHeight);
        }
        if (this.resizeDirection === 3 || this.resizeDirection === 6 || this.resizeDirection === 7) {
          const add = event.clientX - this.dragStartPos[0];
          this.delegate.position.x = Math.min(Math.max(this.dragStartWindowPos[0] + add, 0),
            this.dragStartWindowPos[0] + this.resizeStartSize[0] - WindowFrameComponent.minWidth);
          this.delegate.position.width = Math.max(this.resizeStartSize[0] - add, WindowFrameComponent.minWidth);
        }
        if (this.resizeDirection === 4 || this.resizeDirection === 7 || this.resizeDirection === 8) {
          const add = event.clientY - this.dragStartPos[1];
          this.delegate.position.y = Math.min(Math.max(this.dragStartWindowPos[1] + add, 0),
            this.dragStartWindowPos[1] + this.resizeStartSize[1] - WindowFrameComponent.minHeight);
          this.delegate.position.height = Math.max(this.resizeStartSize[1] - add, WindowFrameComponent.minHeight);
        }
      }
    }
  }

  @HostListener('document:mouseup')
  mouseUp() {
    this.dragging = false;
    this.resizing = false;
  }

  minimize() {
    this.windowManager.unfocus();
    this.delegate.position.minimized = true;
  }

  maximize() {
    this.delegate.position.maximized = !this.delegate.position.maximized;
  }

}
