import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { TestWindowDelegate } from '../../app/desktop/windows/test-window/test-window.component';
import { TerminalWindowDelegate } from '../../app/desktop/windows/terminal/terminal.component';
import { MinerWindowDelegate } from '../../app/desktop/windows/miner/miner.component';
import { SettingsWindowDelegate } from '../../app/desktop/windows/settings/settings.component';
import { TaskManagerWindowDelegate } from '../../app/desktop/windows/task-manager/task-manager.component';

export const programWindows = {
  'browser': TestWindowDelegate,
  'fileManager': TestWindowDelegate,
  'terminal': TerminalWindowDelegate,
  'miner': MinerWindowDelegate,
  'settings': SettingsWindowDelegate,
  'task-manager': TaskManagerWindowDelegate
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
      new Position(20, 10)
    ),
    new Program(
      'file-manager',
      programWindows['file-manager'],
      'File-Manager',
      '../../assets/desktop/img/filemanager.svg',
      true,
      new Position(20, 90)
    ),
    new Program(
      'terminal',
      programWindows['terminal'],
      'Terminal',
      '../../assets/desktop/img/terminal.svg',
      true,
      new Position(20, 180)
    ),
    new Program(
      'miner',
      programWindows['miner'],
      'Miner',
      '../../assets/desktop/img/morphcoin_dark.svg',
      true,
      new Position(20, 270)
    ),
    new Program(
      'settings',
      programWindows['settings'],
      'Settings',
      '../../assets/desktop/img/terminal.svg',
      true,
      new Position(20, 360)
    ),
    new Program(
      'task-manager',
      programWindows['task-manager'],
      'Task-Manager',
      '../../assets/desktop/img/task-manager.svg',
      true,
      new Position(20, 450)
    )
  ]
};
