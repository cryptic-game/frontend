import {Type} from '@angular/core';

export abstract class Window {
  title: string;
  icon: string;
  type: Type<any>;

  position: WindowPosition = {
    x: 0,
    y: 0,
    width: 600,
    height: 400,
    zIndex: 1,
    active: false,
    maximized: false,
    minimized: false
  };
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
