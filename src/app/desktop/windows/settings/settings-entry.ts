import {SettingService} from '../../../api/setting/setting.service';

export abstract class SettingsEntry<T> {
  protected cached: T;

  constructor(public key: string, public defaultValue: T, protected settingService: SettingService) {
  }

  abstract serialize(value: T): string;

  abstract deserialize(data: string): T;

  getCacheOrDefault(): T {
    if (this.cached == null) {
      return this.defaultValue;
    } else {
      return this.cached;
    }
  }

  async get(): Promise<T> {
    if (this.cached == null) {
      return this.getFresh();
    } else {
      return this.cached;
    }
  }

  async getFresh(): Promise<T> {
    try {
      const data: string = (await this.settingService.get(this.key).toPromise())!;
      this.cached = this.deserialize(data);
    } catch (e) {
      // @ts-ignore
      if (e.message !== 'unknown setting') {
        console.warn(e);
      }
      this.cached = this.defaultValue;
    }
    return this.cached;
  }

  async set(value: T) {
    this.cached = value;
    await this.settingService.set(this.key, this.serialize(value)).toPromise();
  }

  async reset() {
    this.cached = this.defaultValue;
    try {
      await this.settingService.set(this.key, this.serialize(this.defaultValue)).toPromise();
    } catch (e) {
      console.warn(e);
    }
  }
}

export class StringSetting extends SettingsEntry<string> {
  serialize(value: string): string {
    return value;
  }

  deserialize(data: string): string {
    return data;
  }
}

export class BooleanSetting extends SettingsEntry<boolean> {
  serialize(value: boolean): string {
    return value ? 'true' : 'false';
  }

  deserialize(data: string): boolean {
    return data.toLowerCase() === 'true';
  }
}

export class ColorSetting extends SettingsEntry<string> {
  private static REGEX = /^#[0-9a-fA-F]{6}$/;

  serialize(value: string): string {
    if (ColorSetting.REGEX.test(value)) {
      return value;
    } else {
      throw new Error(`Invalid color: '${value}'`);
    }
  }

  deserialize(data: string): string {
    if (ColorSetting.REGEX.test(data)) {
      return data;
    } else {
      throw new Error(`Invalid color: '${data}'`);
    }
  }
}

export class EnumSetting extends SettingsEntry<string> {
  constructor(key: string, defaultValue: string, settingService: SettingService, public acceptedValues: string[]) {
    super(key, defaultValue, settingService);
  }

  serialize(value: string): string {
    if (this.acceptedValues.includes(value)) {
      return value;
    } else {
      throw new Error(`Invalid value: '${value}'`);
    }
  }

  deserialize(data: string): string {
    if (this.acceptedValues.includes(data)) {
      return data;
    } else {
      throw new Error(`Invalid value: '${data}'`);
    }
  }
}
