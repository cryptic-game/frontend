import { Injectable } from '@angular/core';
import { Settings } from '../../../../dataclasses/settings';
import { availableBackgrounds } from '../../../../assets/desktop/backgrounds/backgrounds';

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

  getBackgroundPossibilities(): string[] {
    return Object.keys(availableBackgrounds);
  }

  getBackgroundUrl(backgroundName: string): string {
    return availableBackgrounds[backgroundName];
  }

  // Terminal prompt color
  getTPC(): string {
    return this.getSettings().tpc;
  }

  // ls command folder color
  getLSFC(): string {
    return this.getSettings().lsfc;
  }

  // ls command prefix
  getLSPrefix(): boolean {
    return this.getSettings().lsfp;
  }

}
