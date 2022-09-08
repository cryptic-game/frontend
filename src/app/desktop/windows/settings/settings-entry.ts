import { SettingService } from '../../../api/setting/setting.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export abstract class SettingsEntry<T> {
  protected cached: T;

  constructor(public key: string, public defaultValue: T, protected settingService: SettingService) {}

  abstract serialize(value: T): string;

  abstract deserialize(data: string): T;

  getCacheOrDefault(): T {
    if (this.cached == null) {
      return this.defaultValue;
    } else {
      return this.cached;
    }
  }

  get(): Observable<T> {
    if (this.cached == null) {
      return this.getFresh();
    } else {
      return of(this.cached);
    }
  }

  getFresh(): Observable<T> {
    return this.settingService.get(this.key).pipe(
      map((data: string) => {
        return (this.cached = this.deserialize(data));
      }),
      catchError((e) => {
        // @ts-ignore
        if (e.message !== 'unknown setting') {
          console.warn(e);
        }
        this.cached = this.defaultValue;
        return of(this.cached);
      })
    );
  }

  set(value: T) {
    this.cached = value;
    this.settingService.set(this.key, this.serialize(value)).subscribe();
  }

  async reset() {
    this.cached = this.defaultValue;
    await this.settingService.set(this.key, this.serialize(this.defaultValue)).subscribe({
      error: (e: Error) => {
        console.warn(e);
      },
    });
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
