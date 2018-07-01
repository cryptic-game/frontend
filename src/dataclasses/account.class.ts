export class Account {
  private name: string;
  private email: string;

  constructor(Name: string, Email: string) {
    this.name = Name;
    this.email = Email;
  }

  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public setName(Name: string): void {
    this.name = Name;
  }
  public setEmail(Email: string): void {
    this.email = Email;
  }
}
