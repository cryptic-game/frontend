export class Position {
  private x: number;
  private y: number;

  constructor(X: number, Y: number) {
    this.x = X;
    this.y = Y;
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public setX(X: number): void {
    this.x = X;
  }
  public setY(Y: number): void {
    this.y = Y;
  }
}
