import { Component, ComponentFactoryResolver, HostListener, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { WindowDelegate } from './window-delegate';
import { WindowPlaceDirective } from './window-place.directive';
import { GlobalCursorService } from '../../global-cursor.service';
import { WindowManager } from '../window-manager/window-manager';

@Component({
  selector: 'app-window-frame',
  templateUrl: './window-frame.component.html',
  styleUrls: ['./window-frame.component.scss']
})
export class WindowFrameComponent implements OnInit {
  cursorLock: number;

  @ViewChild(WindowPlaceDirective, { static: true }) windowPlace: WindowPlaceDirective;

  @Input() delegate: WindowDelegate;
  @Input() windowManager: WindowManager;
  dragging = false;
  dragStartWindowPos: [number, number] = [0, 0];
  dragStartPos: [number, number] = [0, 0];
  resizing = false;
  resizeDirection = 0;
  resizeStartSize: [number, number] = [0, 0];

  constructor(private cursorService: GlobalCursorService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector) {
  }

  ngOnInit() {
    this.loadWindowContent();
  }

  loadWindowContent() {
    const inj = Injector.create({
      providers: [
        { provide: WindowManager, useValue: this.windowManager },
        { provide: WindowDelegate, useValue: this.delegate }
      ],
      parent: this.injector
    });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.delegate.type);
    const componentRef = this.windowPlace.viewContainerRef.createComponent(componentFactory, undefined, inj);
    componentRef.instance.delegate = this.delegate;
    this.delegate.component = componentRef.instance;
  }

  close() {
    this.windowManager.closeWindow(this.delegate);
  }

  startDragging(event: MouseEvent) {
    if (this.checkResizeDirection(event.clientX, event.clientY, event.target as Element) === 0) {
      this.dragging = true;
      this.dragStartPos = [event.clientX, event.clientY];
      this.dragStartWindowPos = [this.delegate.position.x, this.delegate.position.y];
    }
  }

  checkResizeDirection(clientX, clientY, target: Element) {
    if (target === undefined) {
      return 0;
    }

    if (!this.delegate.constraints.resizable || this.dragging || this.delegate.position.maximized || this.resizing) {
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
      event.preventDefault();
      event.stopImmediatePropagation();
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

    if (direction === 0) {
      this.cursorService.releaseCursor(this.cursorLock);
    } else {
      this.setCursor({
        7: 'nw-resize',
        8: 'ne-resize',
        6: 'sw-resize',
        5: 'se-resize',
        4: 'n-resize',
        3: 'w-resize',
        2: 's-resize',
        1: 'e-resize',
      }[direction]);
    }
  }

  setCursor(cursor) {
    this.cursorLock = this.cursorService.requestCursor(cursor, this.cursorLock);
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
         * 7  4  8
         * 3     1
         * 6  2  5
         */
        const constraints = this.delegate.constraints;

        // Top
        if (this.resizeDirection === 4 || this.resizeDirection === 7 || this.resizeDirection === 8) {
          // new height = start height - (mouse y - start mouse y)
          const newHeight = Math.min(
            Math.max(this.resizeStartSize[1] - (event.clientY - this.dragStartPos[1]), constraints.minHeight),
            constraints.maxHeight,
            this.dragStartWindowPos[1] + this.resizeStartSize[1]  // max height to prevent resizing out of the browser window
          );

          this.delegate.position.y = this.dragStartWindowPos[1] - newHeight + this.resizeStartSize[1];
          this.delegate.position.height = newHeight;
        }

        // Left
        if (this.resizeDirection === 3 || this.resizeDirection === 6 || this.resizeDirection === 7) {
          // new width = start width - (mouse x - start mouse x)
          const newWidth = Math.min(
            Math.max(this.resizeStartSize[0] - (event.clientX - this.dragStartPos[0]), constraints.minWidth),
            constraints.maxWidth,
            this.dragStartWindowPos[0] + this.resizeStartSize[0]  // max width to prevent resizing out of the browser window
          );

          this.delegate.position.x = this.dragStartWindowPos[0] - newWidth + this.resizeStartSize[0];
          this.delegate.position.width = newWidth;
        }

        //  Bottom
        if (this.resizeDirection === 2 || this.resizeDirection === 5 || this.resizeDirection === 6) {
          this.delegate.position.height = Math.min(
            Math.max(this.resizeStartSize[1] + event.clientY - this.dragStartPos[1], constraints.minHeight),
            constraints.maxHeight,
            window.innerHeight - this.dragStartWindowPos[1]
          );
        }

        // Right
        if (this.resizeDirection === 1 || this.resizeDirection === 5 || this.resizeDirection === 8) {
          this.delegate.position.width = Math.min(
            Math.max(this.resizeStartSize[0] + event.clientX - this.dragStartPos[0], constraints.minWidth),
            constraints.maxWidth,
            window.innerWidth - this.dragStartWindowPos[0]
          );
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
    if (this.delegate.constraints.maximizable) {
      this.delegate.position.maximized = !this.delegate.position.maximized;
    }
  }

}
