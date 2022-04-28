import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { SettingsService } from './settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsEntry } from './settings-entry';
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends WindowComponent implements OnInit {
  settingEntries: [string, SettingsEntry<any>][] = Object.entries({
    backgroundImage: this.settings.backgroundImage,
    terminalPromptColor: this.settings.terminalPromptColor,
    terminalLsFolderColor: this.settings.terminalLsFolderColor,
    terminalLsPrefix: this.settings.terminalLsPrefix
  });

  form: FormGroup;

  constructor(public settings: SettingsService, private formBuilder: FormBuilder) {
    super();
    this.initForm();
  }

  ngOnInit() {
    this.loadForm().then();
  }

  initForm() {
    const controlsConfig: { [name: string]: unknown[] } = {};
    for (const [name, setting] of this.settingEntries) {
      controlsConfig[name] = [setting.getCacheOrDefault()];
    }
    this.form = this.formBuilder.group(controlsConfig);
  }

  async loadForm() {
    forkJoin(this.settingEntries.map(
      ([name, setting]) => setting.getFresh().pipe(
        map(value => ({ name, value: value ?? setting.defaultValue }))
      )
    )).subscribe(values => {
      const result: { [name: string]: unknown } = {};
      values.forEach(x => result[x.name] = x.value)
      this.form.setValue(result);
    })
  }

  async resetSettings() {
    await Promise.all(this.settingEntries.map(async ([name, setting]) => {
      await setting.reset();
      this.form.patchValue({ [name]: setting.getCacheOrDefault() });
    }));
  }

  async saveSettings() {
    console.log(this.form.value)
    console.log(this.settingEntries)
    await Promise.all(
      this.settingEntries.map(([name, setting]) => setting.set(this.form.value[name]))
    );
  }

  // async saveOneSettings(setter: String) {
  //   console.log(this.form.value)
  //   console.log(this.settingEntries)
  //   await Promise.all(
  //     this.settingEntries.map(([name, setter]) => setter.set(this.form.value[name]))
  //   );
  // }

}

export class SettingsWindowDelegate extends WindowDelegate {
  title = 'Settings';
  icon = 'assets/desktop/img/gear.svg';
  type: Type<any> = SettingsComponent;

  override constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });
}
