import { Program } from '../../dataclasses/program';
import { Position } from '../../dataclasses/position';
import { TerminalWindowDelegate } from '../../app/desktop/windows/terminal/terminal.component';
import { MinerWindowDelegate } from '../../app/desktop/windows/miner/miner.component';
import { SettingsWindowDelegate } from '../../app/desktop/windows/settings/settings.component';
import { TaskManagerWindowDelegate } from '../../app/desktop/windows/task-manager/task-manager.component';
import { WalletAppWindowDelegate } from '../../app/desktop/windows/wallet-app/wallet-app.component';
import { HardwareShopWindowDelegate } from '../../app/desktop/windows/hardware-shop/hardware-shop.component';
import { EditorWindowDelegate } from '../../app/desktop/windows/editor/editor.component';
import { FileManagerWindowDelegate } from '../../app/desktop/windows/file-manager/file-manager.component';
import { YoutubeDelegate } from '../../app/desktop/windows/youtube/youtube.component';


export const desktopDefinition = {
  programs: [
    new Program(
      'file-manager',
      FileManagerWindowDelegate,
      'File-Manager',
      'assets/desktop/img/filemanager.svg',
      true,
      new Position(20, 30)
    ),
    new Program(
      'terminal',
      TerminalWindowDelegate,
      'Terminal',
      'assets/desktop/img/terminal.svg',
      true,
      new Position(20, 130)
    ),
    new Program(
      'miner',
      MinerWindowDelegate,
      'Miner',
      'assets/desktop/img/morphcoin_dark.svg',
      true,
      new Position(20, 230)
    ),
    new Program(
      'settings',
      SettingsWindowDelegate,
      'Settings',
      'assets/desktop/img/gear.svg',
      true,
      new Position(20, 330)
    ),
    new Program(
      'task-manager',
      TaskManagerWindowDelegate,
      'Task-Manager',
      'assets/desktop/img/task-manager.svg',
      true,
      new Position(20, 430)
    ),
    new Program(
      'wallet-app',
      WalletAppWindowDelegate,
      'Wallet-App',
      'assets/desktop/img/wallet_app.svg',
      true,
      new Position(20, 530)
    ),
    new Program(
      'hardware-shop-app',
      HardwareShopWindowDelegate,
      'Hardware-Shop-App',
      'assets/desktop/img/hardware_shop_app.svg',
      true,
      new Position(20, 630)
    ),
    new Program(
      'editor-app',
      EditorWindowDelegate,
      'Editor',
      'assets/desktop/img/editor.svg',
      true,
      new Position(110, 30)
    ),
    new Program(
      'youtube-app',
      YoutubeDelegate,
      'Youtube',
      'assets/desktop/img/gear.svg',
      true,
      new Position(110, 130)
    )
  ]
};
