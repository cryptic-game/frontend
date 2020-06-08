import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { Device } from '../../api/devices/device';

export abstract class WindowDelegate {
  abstract title: string;
  abstract icon: string;
  abstract type: Type<WindowComponent>;

  constraints: WindowConstraints = new WindowConstraints();

  component: WindowComponent;
  device: Device;

  position: WindowPosition = {
    x: 0,
    y: 0,
    width: Math.min(Math.max(600, this.constraints.minWidth), this.constraints.maxWidth),
    height: Math.min(Math.max(400, this.constraints.minHeight), this.constraints.maxHeight),
    zIndex: 1,
    active: false,
    maximized: false,
    minimized: false
  };
}

export class WindowConstraints {
  constructor(constraints: Partial<WindowConstraints> = {}) {
    Object.assign(this, constraints);
  }

  singleInstance = false;

  resizable = true;
  maximizable = true;

  minWidth = 300;
  minHeight = 150;

  maxWidth = 2 ** 15;
  maxHeight = 2 ** 15;
}

export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  active: boolean;
  maximized: boolean;
  minimized: boolean;
}

export abstract class WindowComponent {
  delegate: WindowDelegate;
  events = new Subject<string>();
}
