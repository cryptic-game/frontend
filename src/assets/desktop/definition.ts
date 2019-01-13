import {Program} from '../../dataclasses/program';
import {Position} from '../../dataclasses/position';

export const desktopDefinition = {
  username: localStorage.getItem('username'),
  programs: {
    Browser: new Program(
      'Browser',
      '../../assets/desktop/img/browser.svg',
      'Browser',
      true,
      new Position(20, 10, 0)
    ),
    Filemanager: new Program(
      'Filemanager',
      '../../assets/desktop/img/filemanager.svg',
      'Filemanager',
      true,
      new Position(20, 90, 1)
    )
  }
};
