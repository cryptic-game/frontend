export class Position {
  private x: number;
  private y: number;
  private z: number;

  constructor(X: number, Y: number, Z?: number) {
    this.x = X;
    this.y = Y;
    this.z = Z;
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public getZ(): number {
    return this.z;
  }
  public setX(X: number): void {
    this.x = X;
  }
  public setY(Y: number): void {
    this.y = Y;
  }
  public setZ(Z: number): void {
    this.z = Z;
  }
}
