export class ErrorBackend {
  private title: string;
  private msg: string;

  constructor(Title: string, Msg: string) {
    this.title = Title;
    this.msg = Msg;
  }

  public getName(): string {
    return this.title;
  }
  public getEmail(): string {
    return this.msg;
  }
  public setTitle(Title: string): void {
    this.title = Title;
  }
  public setMsg(Msg: string): void {
    this.msg = Msg;
  }
}
