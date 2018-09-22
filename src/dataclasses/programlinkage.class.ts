import { Position } from './position.class';

export class ProgramLinkage {
  private displayname: string;
  private icon: string;
  private program: string;
  private desktop: boolean;
  private position: Position;
  constructor(
    DisplayName: string,
    Icon: string,
    Program: string,
    Desktop: boolean,
    position: Position
  ) {
    this.displayname = DisplayName;
    this.icon = Icon;
    this.program = Program;
    this.desktop = Desktop;
    this.position = position;
  }
  public getDisplayName(): string {
    return this.displayname;
  }
  public getIcon(): string {
    return this.icon;
  }
  public getProgram(): string {
    return this.program;
  }
  public onDesktop(): boolean {
    return this.desktop;
  }
  public getPosition(): Position {
    return this.position;
  }
  public setDisplayName(DisplayName: string): void {
    this.displayname = DisplayName;
  }
  public setIcon(Icon: string): void {
    this.icon = Icon;
  }
  public setProgram(Program: string): void {
    this.program = Program;
  }
  public switchDesktop(): void {
    this.desktop = !this.desktop;
  }
  public setPosition(position: Position): void {
    this.position = position;
  }
}
