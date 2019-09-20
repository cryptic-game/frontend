import {Component, OnInit, Type} from '@angular/core';
import {WindowComponent, WindowDelegate} from '../../window/window-delegate';
import {TestWindowComponent} from '../test-window/test-window.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends WindowComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onChangeSetting(setting: string, value: any) {
    // TODO actually change the setting
    console.log(`changed ${setting} to ${value}`);
  }
}

export class SettingsWindowDelegate extends WindowDelegate {
  title = 'Settings';
  icon = 'assets/desktop/img/filemanager.svg';
  type: Type<any> = SettingsComponent;
}
