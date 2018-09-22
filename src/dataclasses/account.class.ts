export class Account {
  private username: string;
  private email: string;

  constructor(Name: string, Email: string) {
    this.username = Name;
    this.email = Email;
  }

  public getName(): string {
    return this.username;
  }
  public getEmail(): string {
    return this.email;
  }
  public setName(Name: string): void {
    this.username = Name;
  }
  public setEmail(Email: string): void {
    this.email = Email;
  }
}
