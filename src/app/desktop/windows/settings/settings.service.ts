import { Injectable } from '@angular/core';
import { Settings } from '../../../../dataclasses/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
  }

  public getSettings(): Settings {
    const settingsJSON = localStorage.getItem('settings');
    if (settingsJSON === 'null') {
      return Settings.default();
    } else {
      return Settings.fromJSON(settingsJSON);
    }
  }

  public setSettings(settings: Settings): void {
    localStorage.setItem('settings', Settings.toJSON(settings));
  }

  public modify(callback: (value: Settings) => void) {
    const setting = this.getSettings();
    callback(setting);
    this.setSettings(setting);
  }
}
