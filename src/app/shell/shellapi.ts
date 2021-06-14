import {TerminalAPI} from '../desktop/windows/terminal/terminal-api';
import {WebsocketService} from '../websocket.service';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from '../desktop/windows/settings/settings.service';
import {FileService} from '../api/files/file.service';
import {Device} from '../api/devices/device';
import {WindowDelegate} from '../desktop/window/window-delegate';
import {File} from 'src/app/api/files/file';
import {DeviceService} from '../api/devices/device.service';


export class ShellApi {
  constructor(
  public websocket: WebsocketService,
  public settings: SettingsService,
  public fileService: FileService,
  public deviceService: DeviceService,
  public domSanitizer: DomSanitizer,
  public windowDelegate: WindowDelegate,
  public activeDevice: Device,
  public terminal: TerminalAPI,
  public promptColor: string,
  public refreshPrompt: () => void,
  public working_dir: string
  ) {}

  public async listFilesOfWorkingDir(): Promise<File[]> {
      return await this.fileService.getFiles(this.activeDevice['uuid'], this.working_dir).toPromise();
  }
}
