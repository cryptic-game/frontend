import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { TestWindowDelegate } from '../../app/desktop/windows/test-window/test-window.component';
import { TerminalWindowDelegate } from '../../app/desktop/windows/terminal/terminal.component';
import {SettingsWindowDelegate} from '../../app/desktop/windows/settings/settings.component';

export const programWindows = {
  'browser': TestWindowDelegate,
  'fileManager': TestWindowDelegate,
  'terminal': TerminalWindowDelegate,
  'settings': SettingsWindowDelegate
};

export const desktopDefinition = {
  username: localStorage.getItem('username'),
  programs: [
    new Program(
      'browser',
      programWindows['browser'],
      'Browser',
      '../../assets/desktop/img/browser.svg',
      true,
      new Position(20, 10, 0)
    ),
    new Program(
      'fileManager',
      programWindows['fileManager'],
      'File-Manager',
      '../../assets/desktop/img/filemanager.svg',
      true,
      new Position(20, 90, 0)
    ),
    new Program(
      'terminal',
      programWindows['terminal'],
      'Terminal',
      '../../assets/desktop/img/terminal.svg',
      true,
      new Position(20, 180, 0)
    ),
    new Program(
      'settings',
      programWindows['settings'],
      'Settings',
      '../../assets/desktop/img/terminal.svg',
      true,
      new Position(20, 270, 0)
    )
  ]
};
