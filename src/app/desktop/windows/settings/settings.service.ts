import { Injectable } from '@angular/core';
import { availableBackgrounds } from '../../../../assets/desktop/backgrounds/backgrounds';
import { BooleanSetting, ColorSetting, EnumSetting } from './settings-entry';
import { SettingService } from '../../../api/setting/setting.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  backgroundImage = new EnumSetting(
    'background_image',
    'default',
    this.settingService,
    Object.keys(availableBackgrounds)
  );
  terminalPromptColor = new ColorSetting('terminal_prompt_color', '#64DD17', this.settingService);
  terminalLsFolderColor = new ColorSetting('terminal_ls_folder_color', '#41ABFC', this.settingService);
  // ls command file/folder prefix
  terminalLsPrefix = new BooleanSetting('terminal_ls_prefix', false, this.settingService);

  constructor(private settingService: SettingService) {}
}
