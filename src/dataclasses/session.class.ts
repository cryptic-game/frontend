export class Session {
  private token: string;
  private create_date: Date;
  private expire_date: Date;

  constructor(Token: string, CreateDate: Date, ExpireDate: Date) {
    this.token = Token;
    this.create_date = CreateDate;
    this.expire_date = ExpireDate;
  }

  public getToken(): string {
    return this.token;
  }
  public getCreateDate(): Date {
    return this.create_date;
  }
  public getExpireDate(): Date {
    return this.expire_date;
  }
  public setToken(Token: string): void {
    this.token = Token;
  }
  public setCreateDate(CreateDate: Date) {
    this.create_date = CreateDate;
  }
  public setExpireDate(ExpireDate: Date) {
    this.expire_date = ExpireDate;
  }
}
