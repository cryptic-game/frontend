import {Program} from '../../dataclasses/program';
import {Position} from '../../dataclasses/position';
import {TestWindowComponent} from '../../app/desktop/windows/test-window/test-window.component';
import {TerminalComponent} from '../../app/desktop/windows/terminal/terminal.component';

export const programWindows = {
  'browser': TestWindowComponent,
  'fileManager': TestWindowComponent,
  'terminal': TerminalComponent
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
      'File Manager',
      '../../assets/desktop/img/filemanager.svg',
      true,
      new Position(20, 90, 1)
    ),
    new Program(
      'terminal',
      programWindows['terminal'],
      'Terminal',
      '',
      true,
      new Position(20, 170, 2)
    )
  ]
};
