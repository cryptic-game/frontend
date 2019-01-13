import {Position} from './position';

// TODO: Add window delegate property

export class Program {
  constructor(
    public displayName: string,
    public icon: string,
    public programName: string,
    public onDesktop: boolean,
    public position: Position
  ) {
  }
  public switchDesktop(): void {
    this.onDesktop = !this.onDesktop;
  }
}
