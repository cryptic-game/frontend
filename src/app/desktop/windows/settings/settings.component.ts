import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { Settings } from '../../../../dataclasses/settings';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends WindowComponent implements OnInit {
  
  constructor(public current: SettingsService) {
    super();
  }

  ngOnInit() {}

  onChangeSetting(): void {}

  resetSettings(): void {
    this.current.setSettings(Settings.default());
  }

  setBackground(backgroundName: string) {
    this.current.modify(x => (x.backgroundImage = backgroundName));
  }

  setTerminalPromptColor(color: string) {
    this.current.modify(x => (x.tpc = color));
  }

  saveSettings(backgroundName: string, color: string) {
    this.setBackground(backgroundName);
    this.setTerminalPromptColor(color);
  }

}

export class SettingsWindowDelegate extends WindowDelegate {
  title = 'Settings';
  icon = 'assets/desktop/img/gear.svg';
  type: Type<any> = SettingsComponent;
}
