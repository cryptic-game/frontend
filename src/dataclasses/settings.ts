export class Settings {
  constructor(public backgroundImage: string, public tpc: string) {
  }

  public static default(): Settings {
    return new Settings('default', '#64DD17');
  }

  public static toJSON(settings: Settings): string {
    return JSON.stringify(settings);
  }

  public static fromJSON(saveData: string): Settings {
    return Object.assign(this.default(), JSON.parse(saveData));
  }
}
