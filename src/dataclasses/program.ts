import { Position } from './position';
import { WindowDelegate } from '../app/desktop/window/window-delegate';
import { Type } from '@angular/core';

export class Program {
  constructor(
    public id: string,
    public windowDelegate: Type<WindowDelegate>,
    public displayName: string,
    public icon: string,
    public onDesktop: boolean,
    public position: Position
  ) {}

  public newWindow(): WindowDelegate {
    return new this.windowDelegate();
  }

  public switchDesktop(): void {
    this.onDesktop = !this.onDesktop;
  }
}
