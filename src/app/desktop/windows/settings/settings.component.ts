import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
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

  ngOnInit() {
  }

  onChangeSetting(): void {
  }

  resetSettings(): void {
    this.current.setSettings(Settings.default());
  }

  setBackground(backgroundName: string) {
    this.current.modify(x => (x.backgroundImage = backgroundName));
  }

  setTerminalPromptColor(color: string) {
    this.current.modify(x => (x.tpc = color));
  }

  setLsFolderColor(color: string) {
    this.current.modify(x => (x.lsfc = color));
  }

  setLsPrefix(lsfp: boolean) {
    this.current.modify(x => (x.lsfp = lsfp));
  }

  saveSettings(backgroundName: string, tps: string, lsfc: string, lsfp: boolean) {
    this.setBackground(backgroundName);
    this.setTerminalPromptColor(tps);
    this.setLsFolderColor(lsfc);
    this.setLsPrefix(lsfp);
  }

}

export class SettingsWindowDelegate extends WindowDelegate {
  title = 'Settings';
  icon = 'assets/desktop/img/gear.svg';
  type: Type<any> = SettingsComponent;

  constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });
}
