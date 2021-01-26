export class Settings {
  constructor(public backgroundImage: string, public tpc: string, public lsfc: string, public lsfp: boolean) {
  }

  public static default(): Settings {
    return new Settings('default', '#64DD17', '#41ABFC', false);
  }

  public static toJSON(settings: Settings): string {
    return JSON.stringify(settings);
  }

  public static fromJSON(saveData: string): Settings {
    return Object.assign(this.default(), JSON.parse(saveData));
  }
}
