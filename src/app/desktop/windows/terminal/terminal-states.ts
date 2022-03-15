import {TerminalAPI, TerminalState} from './terminal-api';
import {WebsocketService} from '../../../websocket.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {SecurityContext} from '@angular/core';
import {SettingsService} from '../settings/settings.service';
import {FileService} from '../../../api/files/file.service';
import {Path} from '../../../api/files/path';
import {EMPTY, of} from 'rxjs';
import {Device} from '../../../api/devices/device';
import {WindowDelegate} from '../../window/window-delegate';
import {File} from '../../../api/files/file';
import {BruteforceTerminalState, YesNoTerminalState} from "./TerminalStateImpls";
import {formatNumber} from "@angular/common";


function escapeHtml(html: string) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function reportError(error: Error) {
  console.warn(new Error(error.message));
}

export abstract class CommandTerminalState implements TerminalState {
  abstract commands: {
    [name: string]: {
      executor: (args: string[]) => void;
      description: string;
      hideFromHelp?: boolean;
      hideFromProtocol?: boolean;
    }
  };

  protocol: string[] = [];

  executeCommand(command: string, args: string[]) {
    command = command.toLowerCase();
    if (this.commands.hasOwnProperty(command)) {
      this.commands[command].executor(args);

      // Only successful and not-flagged commands will be shown in the protocol.
      if (!this.commands[command].hideFromProtocol) {
        if (args.length > 0) {
          this.protocol.unshift(command + ' ' + args.join(' '));
        } else {
          this.protocol.unshift(command);
        }
      }
    } else if (command !== '') {
      this.commandNotFound(command);
    }
  }

  execute(command: string) {
    const command_ = command.trim().split(' ');
    if (command_.length === 0) {
      return;
    }
    this.executeCommand(command_[0], command_.slice(1));
  }

  abstract commandNotFound(command: string): void;

  autocomplete(content: string): string {
    return content
      ? Object.entries(this.commands)
        .filter(command => !command[1].hideFromHelp)
        .map(([name]) => name)
        .sort()
        .find(n => n.startsWith(content))!
      : '';
  }

  getHistory(): string[] {
    return this.protocol;
  }

  abstract refreshPrompt(): void;

}


export class DefaultTerminalState extends CommandTerminalState {

  commands = {
    'help': {
      executor: this.help.bind(this),
      description: 'list of all commands'
    },
    'miner': {
      executor: this.miner.bind(this),
      description: 'manages morphcoin miners'
    },
    'status': {
      executor: this.status.bind(this),
      description: 'displays the number of online players'
    },
    'hostname': {
      executor: this.hostname.bind(this),
      description: 'changes the name of the device'
    },
    'cd': {
      executor: this.cd.bind(this),
      description: 'changes the working directory'
    },
    'ls': {
      executor: this.ls.bind(this),
      description: 'shows files of the current working directory'
    },
    'l': {
      executor: this.ls.bind(this),
      description: 'shows files of the current working directory'
    },
    'dir': {
      executor: this.ls.bind(this),
      description: 'shows files of the current working directory'
    },
    'touch': {
      executor: this.touch.bind(this),
      description: 'create a file'
    },
    'cat': {
      executor: this.cat.bind(this),
      description: 'reads out a file'
    },
    'rm': {
      executor: this.rm.bind(this),
      description: 'deletes a file or a directory'
    },
    'cp': {
      executor: this.cp.bind(this),
      description: 'copys a file'
    },
    'mv': {
      executor: this.mv.bind(this),
      description: 'moves a file'
    },
    'rename': {
      executor: this.rename.bind(this),
      description: 'renames a file'
    },
    'mkdir': {
      executor: this.mkdir.bind(this),
      description: 'creates a directory'
    },
    'exit': {
      executor: this.exit.bind(this),
      description: 'closes the terminal or leaves another device'
    },
    'quit': {
      executor: this.exit.bind(this),
      description: 'closes the terminal or leaves another device'
    },
    'clear': {
      executor: this.clear.bind(this),
      description: 'clears the terminal'
    },
    'history': {
      executor: this.history.bind(this),
      description: 'shows or clears the command history of the current terminal session',
      hideFromProtocol: true
    },
    'morphcoin': {
      executor: this.morphcoin.bind(this),
      description: 'shows wallet'
    },
    'pay': {
      executor: this.pay.bind(this),
      description: 'sends money to another wallet'
    },
    'service': {
      executor: this.service.bind(this),
      description: 'creates or uses services'
    },
    'spot': {
      executor: this.spot.bind(this),
      description: 'spots other devices'
    },
    'connect': {
      executor: this.connect.bind(this),
      description: 'connects to other device'
    },
    'network': {
      executor: this.network.bind(this),
      description: 'type `network` for further information'
    },
    'info': {
      executor: this.info.bind(this),
      description: 'shows info of the current device'
    },

    // easter egg
    'chaozz': {
      executor: () => this.terminal.outputText('"mess with the best, die like the rest :D`" - chaozz'),
      description: '',
      hideFromHelp: true
    }

  };

  working_dir: string | null = Path.ROOT;  // UUID of the working directory

  constructor(private locale: string, protected websocket: WebsocketService, private settings: SettingsService, private fileService: FileService,
              private domSanitizer: DomSanitizer, protected windowDelegate: WindowDelegate, protected activeDevice: Device,
              protected terminal: TerminalAPI, public promptColor: string | null = null) {
    super();
    this.settings.terminalPromptColor.getFresh().then(() => this.refreshPrompt());
  }

  static registerPromptAppenders(element: HTMLElement) {
    element
      .querySelectorAll('.promptAppender')
      .forEach(el => el.addEventListener('click', DefaultTerminalState.promptAppenderListener));
  }

  static promptAppender(value: string): string {
    return `<span class="promptAppender" style="text-decoration: underline; cursor: pointer;">${escapeHtml(value)}</span>`;
  }

  private static promptAppenderListener(evt: Event) {
    evt.stopPropagation();
    const this_ = evt.target as HTMLElement;
    const cmdline: HTMLInputElement = this_.closest('#terminal-window')!.querySelector('#cmdline')!;
    if (cmdline.selectionStart != null) {
      const startPos = cmdline.selectionStart;
      const addSpace = cmdline.selectionStart === cmdline.value.length;
      cmdline.value =
        cmdline.value.substring(0, startPos) +
        this_.innerText +
        (addSpace ? ' ' : '') +
        cmdline.value.substring(cmdline.selectionEnd!);
      cmdline.focus();
      cmdline.selectionStart = startPos + this_.innerText.length + (addSpace ? 1 : 0);
      cmdline.selectionEnd = cmdline.selectionStart;
    } else {
      cmdline.value += this_.innerText + ' ';
      cmdline.focus();
    }
  }

  commandNotFound(command: string) {
    this.terminal.output('Command could not be found.<br/>Type `help` for a list of commands.');
  }

  refreshPrompt() {
    this.fileService.getAbsolutePath(this.activeDevice['uuid'], this.working_dir!).subscribe(path => {
      const color = this.domSanitizer.sanitize(SecurityContext.STYLE,
        this.promptColor || this.settings.terminalPromptColor.getCacheOrDefault());
      const prompt = this.domSanitizer.bypassSecurityTrustHtml(
        `<span style="color: ${color}">` +
        `${escapeHtml(this.websocket.account.name)}@${escapeHtml(this.activeDevice['name'])}` +
        '<span style="color: white">:</span>' +
        `<span style="color: #0089ff;">/${path.join('/')}</span>$` +
        '</span>'
      );
      this.terminal.changePrompt(prompt);
    });
  }


  help() {
    const table = document.createElement('table');
    Object.entries(this.commands)
      .filter(command => !('hideFromHelp' in command[1]))
      .map(([name, value]) => ({name: name, description: value.description}))
      .map(command => `<tr><td>${command.name}</td><td>${command.description}</td></tr>`)
      .forEach(row => {
        table.innerHTML += row;
      });
    this.terminal.outputNode(table);
  }

  miner(args: string[]) {
    //TODO: Type me correct
    let miner: any;
    let wallet;
    let power;
    let text;
    if (args.length === 0) {
      this.terminal.outputText('usage: miner look|wallet|power|start');
      return;
    }
    if (args[0] === 'look') {
      this.websocket.ms('service', ['list'], {
        'device_uuid': this.activeDevice['uuid'],
      }).subscribe((listData) => {
        listData.services.forEach((service: any) => {   //TODO: Type me correct
          if (service.name === 'miner') {
            miner = service;
            this.websocket.ms('service', ['miner', 'get'], {
              'service_uuid': miner.uuid,
            }).subscribe(data => {
              wallet = data['wallet'];
              power = Math.round(data['power'] * 100);
              text =
                'Wallet: ' + wallet + '<br>' +
                'Mining Speed: ' + String(formatNumber(Number(miner.speed) * 60 * 60, this.locale)) + ' MC/h<br>' +
                'Power: ' + power + '%';
              this.terminal.output(text);
            });
          }
        });
      });

    } else if (args[0] === 'wallet') {
      if (args.length !== 2) {
        this.terminal.outputText('usage: miner wallet <wallet-id>');
        return;
      }
      this.websocket.ms('service', ['list'], {
        'device_uuid': this.activeDevice['uuid'],
      }).subscribe((listData) => {
        listData.services.forEach((service: any) => {   //TODO: Type me correct
          if (service.name === 'miner') {
            miner = service;
            this.websocket.ms('service', ['miner', 'wallet'], {
              'service_uuid': miner.uuid,
              'wallet_uuid': args[1],
            }).subscribe({
              next: (walletData) => {
                wallet = args[1];
                power = walletData.power;
                this.terminal.outputText(`Set wallet to ${args[1]}`);
              },
              error: () => {
                this.terminal.outputText('Wallet is invalid.');
              }
            });
          }
        });
      });
    } else if (args[0] === 'power') {
      if (args.length !== 2) {
        this.terminal.outputText('usage: miner power <0-100>');
        return;
      }
      if (isNaN(Number(args[1]))) {
        return this.terminal.outputText('usage: miner power <0-100>');
      }
      if (0 > Number(args[1]) || Number(args[1]) > 100) {
        return this.terminal.outputText('usage: miner power <0-100>');
      }
      this.websocket.ms('service', ['list'], {
        'device_uuid': this.activeDevice['uuid'],
      }).subscribe((listData) => {
        listData.services.forEach((service: any) => { //TODO: Type me correct
          if (service.name === 'miner') {
            miner = service;
            this.websocket.ms('service', ['miner', 'power'], {
              'service_uuid': miner.uuid,
              'power': Number(args[1]) / 100,
            }).subscribe(() => {
              this.terminal.outputText('Set Power to ' + args[1] + '%');
            });
          }
        });
      });
    } else if (args[0] === 'start') {
      if (args.length !== 2) {
        this.terminal.outputText('usage: miner start <wallet-id>');
        return;
      }
      this.websocket.ms('service', ['create'], {
        'device_uuid': this.activeDevice['uuid'],
        'name': 'miner',
        'wallet_uuid': args[1],
      }).subscribe({
        next: (service) => {
          miner = service;
        },
        error: () => {
          this.terminal.outputText('Invalid wallet');
          return of<void>();
        }
      });
    } else {
      this.terminal.outputText('usage: miner look|wallet|power|start');
      return;
    }

  }

  status() {
    this.websocket.request({
      action: 'info'
    }).subscribe(r => {
      this.terminal.outputText('Online players: ' + r.online);
    });
  }

  hostname(args: string[]) {
    if (args.length === 1) {
      const hostname = args[0];
      this.websocket.ms('device', ['device', 'change_name'], {
        device_uuid: this.activeDevice['uuid'],
        name: hostname
      }).subscribe({
        next: (newDevice: Device) => {
          this.activeDevice = newDevice;
          this.refreshPrompt();

          if (this.activeDevice.uuid === this.windowDelegate.device.uuid) {
            Object.assign(this.windowDelegate.device, newDevice);
          }
        },
        error: () => {
          this.terminal.outputText('The hostname couldn\'t be changed');
        }
      });
    } else {
      this.websocket.ms('device', ['device', 'info'], {device_uuid: this.activeDevice['uuid']})
        .subscribe({
          next: (device: Device) => {
            if (device['name'] !== this.activeDevice['name']) {
              this.activeDevice = device;
              this.refreshPrompt();
            }
            this.terminal.outputText(device['name']);
          },
          error: () => {
            this.terminal.outputText(this.activeDevice['name']);
          }
        });
    }
  }

  cd(args: string[]) {
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }
      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe({
        next: (file: File) => {
          if (file.is_directory) {
            this.working_dir = file.uuid;
            this.refreshPrompt();
          } else {
            this.terminal.outputText('That is not a directory');
          }
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That directory does not exist');
          } else {
            reportError(error);
          }
        }
      });
    }
  }

  list_files(files: File[]) {
    files.filter((file) => {
      return file.is_directory;
    }).sort().forEach(folder => {
      Promise.all([this.settings.terminalLsFolderColor.get(), this.settings.terminalLsPrefix.get()])
        .then(([folderColor, lsPrefix]) => {
          this.terminal.output(`<span style="color: ${folderColor};">${lsPrefix ? '[Folder] ' : ''}${folder.filename}</span>`);
        });
    });

    files.filter((file) => {
      return !file.is_directory;
    }).sort().forEach(file => {
      this.settings.terminalLsPrefix.get().then(lsPrefix =>
        this.terminal.outputText(`${(lsPrefix ? '[File] ' : '')}${file.filename}`)
      );
    });
  }

  ls(args: string[]) {
    if (args.length === 0) {
      this.fileService.getFiles(this.activeDevice['uuid'], this.working_dir!).subscribe(files => {
        this.list_files(files);
      });
    } else if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe({
        next: (target) => {
          if (target.is_directory) {
            this.fileService.getFiles(this.activeDevice['uuid'], target.uuid).subscribe(files =>
              this.list_files(files)
            );
          } else {
            this.terminal.outputText('That is not a directory');
          }
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That directory does not exist');
          } else {
            reportError(error);
          }
        }
      });
    } else {
      this.terminal.outputText('usage: ls [directory]');
    }
  }

  touch(args: string[]) {
    if (args.length >= 1) {
      const filename = args[0];
      let content = '';

      if (!filename.match(/^[a-zA-Z0-9.\-_]+$/)) {
        this.terminal.outputText('That filename is not valid');
        return;
      }

      if (filename.length > 64) {
        this.terminal.outputText('That filename is too long');
        return;
      }

      if (args.length > 1) {
        content = args.slice(1).join(' ');
      }

      this.fileService.createFile(this.activeDevice['uuid'], filename, content, this.working_dir!).subscribe({
        error: err => {
          if (err.message === 'file_already_exists') {
            this.terminal.outputText('That file already exists');
          } else {
            reportError(err);
          }
        }
      });
    } else {
      this.terminal.outputText('usage: touch <filename> [content]');
    }
  }

  cat(args: string[]) {
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe({
        next: (file: File) => {
          if (file.is_directory) {
            this.terminal.outputText('That is not a file');
          } else {
            this.terminal.outputText(file.content);
          }
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          } else {
            reportError(error);
          }
        }
      });
    } else {
      this.terminal.outputText('usage: cat <filename>');
    }
  }

  rm(args: string[]) {
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe({
        next: (file: File) => {
          const deleteFile = () => {
            this.websocket.ms('device', ['file', 'delete'], {
              device_uuid: this.activeDevice['uuid'],
              file_uuid: file.uuid
            });
          };
          if (file.content.trim().length === 47) {
            const walletCred = file.content.split(' ');
            const uuid = walletCred[0];
            const key = walletCred[1];
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
              this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe({
                next: () => {
                  this.terminal.pushState(
                    new YesNoTerminalState(
                      this.terminal,
                      '<span class="errorText">Are you sure you want to delete your wallet? [yes|no]</span>',
                      answer => {
                        if (answer) {
                          this.websocket.ms('currency', ['delete'], {source_uuid: uuid, key: key})
                            .subscribe({
                              next: () => {
                                this.websocket.ms('device', ['file', 'delete'], {
                                  device_uuid: this.activeDevice['uuid'],
                                  file_uuid: file.uuid
                                });
                              },
                              error: (error: Error) => {
                                this.terminal.output('<span class="error-text"">The wallet couldn\'t be deleted successfully. ' +
                                  'Please report this bug.</span>');
                                reportError(error);
                              }
                            });
                        }
                      }
                    )
                  );
                },
                error: () => deleteFile()
              });
            } else {
              deleteFile();
            }
          } else {
            deleteFile();
          }
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          } else {
            reportError(error);
          }
        }
      });
    } else {
      this.terminal.outputText('usage: rm <filename>');
    }
  }

  cp(args: string[]) {
    if (args.length === 2) {
      let srcPath: Path;
      let destPath: Path;
      try {
        srcPath = Path.fromString(args[0], this.working_dir!);
        destPath = Path.fromString(args[1], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }
      const deviceUUID = this.activeDevice['uuid'];

      this.fileService.getFromPath(deviceUUID, srcPath).subscribe({
        next: (source: File) => {
          this.fileService.copyFile(source, destPath).subscribe({
            error: error => {
              if (error.message === 'file_already_exists') {
                this.terminal.outputText('That file already exists');
              } else if (error.message === 'cannot_copy_directory') {
                this.terminal.outputText('Cannot copy directories');
              } else if (error.message === 'destination_not_found') {
                this.terminal.outputText('The destination folder was not found');
              } else {
                reportError(error);
              }
            }
          });
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          }
        }
      });

    } else {
      this.terminal.outputText('usage: cp <source> <destination>');
    }
  }

  mv(args: string[]) {
    if (args.length === 2) {
      let srcPath: Path;
      let destPath: Path;
      try {
        srcPath = Path.fromString(args[0], this.working_dir!);
        destPath = Path.fromString(args[1], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], srcPath).subscribe({
        next: (source: File) => {
          if (source.is_directory) {
            this.terminal.outputText('You cannot move directories');
            return;
          }
          this.fileService.moveToPath(source, destPath).subscribe({
            error: err => {
              if (err.message === 'destination_is_file') {
                this.terminal.outputText('The destination must be a directory');
              } else if (err.message === 'file_already_exists') {
                this.terminal.outputText('A file with the specified name already exists in the destination directory');
              } else if (err.message === 'file_not_found') {
                this.terminal.outputText('The destination directory does not exist');
              } else {
                reportError(err);
              }
            }
          });
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          } else {
            reportError(error);
          }
        }
      });

    } else {
      this.terminal.outputText('usage: mv <source> <destination>');
    }
  }

  rename(args: string[]) {
    if (args.length === 2) {
      let filePath: Path;
      try {
        filePath = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      const name = args[1];

      if (!name.match(/^[a-zA-Z0-9.\-_]+$/)) {
        this.terminal.outputText('That name is not valid');
        return;
      }

      if (name.length > 64) {
        this.terminal.outputText('That name is too long');
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], filePath).subscribe({
        next: (file: File) => {
          this.fileService.rename(file, name).subscribe({
            error: err => {
              if (err.message === 'file_already_exists') {
                this.terminal.outputText('A file with the specified name already exists');
              } else {
                reportError(err);
              }
            }
          });
        },
        error: (error: Error) => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          } else {
            reportError(error);
          }
        }
      });

    } else {
      this.terminal.outputText('usage: rename <file> <new name>');
    }
  }

  mkdir(args: string[]) {
    if (args.length === 1) {
      const dirname = args[0];
      if (!dirname.match(/^[a-zA-Z0-9.\-_]+$/)) {
        this.terminal.outputText('That directory name is not valid');
        return;
      }

      if (dirname.length > 64) {
        this.terminal.outputText('That directory name is too long');
        return;
      }

      this.fileService.createDirectory(this.activeDevice['uuid'], dirname, this.working_dir!).subscribe({
        error: err => {
          if (err.message === 'file_already_exists') {
            this.terminal.outputText('A file with the specified name already exists');
          } else {
            reportError(err);
          }
        }
      });
    } else {
      this.terminal.outputText('usage: mkdir <directory>');
    }
  }

  exit() {
    this.terminal.popState();
  }

  clear() {
    this.terminal.clear();
  }

  history(args: string[]) {
    if (args[0] === 'clear') {
      this.protocol = [];
    } else if (args.length === 0) {
      const history: string[] = this.getHistory();

      // The history is stored in reverse.
      // Because of that this loop has to run in reverse.
      for (let i = history.length - 1; i >= 0; i--) {
        this.terminal.outputText(history[i]);
      }
    } else {
      this.terminal.outputText('usage: history [clear]');
    }
  }

  morphcoin(args: string[]) {
    if (args.length === 2) {
      if (args[0] === 'reset') {
        this.websocket.ms('currency', ['reset'], {source_uuid: args[1]}).subscribe({
          next: () => {
            this.terminal.outputText('Wallet has been deleted successfully.');
          },
          error: (error: Error) => {
            if (error.message === 'permission_denied') {
              this.terminal.outputText('Permission denied.');
            } else {
              this.terminal.outputText('Wallet does not exist.');
            }
          }
        });
        return;
      }

      let path: Path;
      try {
        path = Path.fromString(args[1], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }

      if (args[0] === 'look') {
        this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe({
          next: (file: File) => {
            if (file.is_directory) {
              this.terminal.outputText('That file does not exist');
              return;
            }

            if (file.content.trim().length === 47) {
              const walletCred = file.content.split(' ');
              const uuid = walletCred[0];
              const key = walletCred[1];
              if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
                this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe({
                  next: (wallet) => {
                    this.terminal.outputText(formatNumber(wallet.amount / 1000, this.locale) + ' morphcoin');
                  },
                  error: () => {
                    this.terminal.outputText('That file is not connected with a wallet');
                  }
                });
              } else {
                this.terminal.outputText('That file is not a wallet file');
              }
            } else {
              this.terminal.outputText('That file is not a wallet file');
            }
          },
          error: (error: Error) => {
            if (error.message === 'file_not_found') {
              this.terminal.outputText('That file does not exist');
            } else {
              reportError(error);
            }
          }
        });

      } else if (args[0] === 'create') {
        (path.path.length > 1
            ? this.fileService.getFromPath(this.activeDevice['uuid'], new Path(path.path.slice(0, -1), path.parentUUID))
            : of({uuid: path.parentUUID})
        ).subscribe(dest => {
          this.fileService.getFromPath(this.activeDevice['uuid'], new Path(path.path.slice(-1), dest.uuid)).subscribe(() => {
            this.terminal.outputText('That file already exists');
          }, error => {
            if (error.message === 'file_not_found') {
              if (path.path[path.path.length - 1].length < 65) {

                this.websocket.ms('currency', ['create'], {})
                  .pipe(
                    switchMap((wallet) => {
                      const credentials = wallet.source_uuid + ' ' + wallet.key;

                      return this.fileService.createFile(this.activeDevice['uuid'], path.path[path.path.length - 1], credentials, this.working_dir!)
                        .pipe(catchError((err: Error) => {
                          this.terminal.outputText('That file couldn\'t be created. Please note your wallet credentials ' +
                            'and put them in a new file with \'touch\' or contact the support: \'' + credentials + '\'');
                          reportError(err);
                          return EMPTY;
                        }))
                    })
                  ).subscribe({
                  error: (error1: Error) => {
                    if (error1.message === 'already_own_a_wallet') {
                      this.terminal.outputText('You already own a wallet');
                    } else {
                      this.terminal.outputText(error1.message);
                      reportError(error1);
                    }
                  }
                });

              } else {
                this.terminal.outputText('Filename too long. Only 64 chars allowed');
              }
            } else {
              reportError(error);
            }
          });
        }, error => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That path does not exist');
          } else {
            reportError(error);
          }
        });
      }
    } else if (args.length === 1 && args[0] === 'list') {
      this.websocket.ms('currency', ['list'], {}).subscribe(data => {
        if (data.wallets.length === 0) {
          this.terminal.outputText('You don\'t own any wallet.');
        } else {
          this.terminal.outputText('Your wallets:');

          const el = document.createElement('ul');
          el.innerHTML = data.wallets
            .map((wallet: string) => '<li>' + DefaultTerminalState.promptAppender(wallet) + '</li>')
            .join((''));

          this.terminal.outputNode(el);
          DefaultTerminalState.registerPromptAppenders(el);
        }
      });
    } else {
      this.terminal.outputText('usage: morphcoin look|create|list|reset [<filename>|<uuid>]');
    }
  }

  pay(args: string[]) {
    if (args.length === 3 || args.length === 4) {
      let walletPath: Path;
      try {
        walletPath = Path.fromString(args[0], this.working_dir!);
      } catch {
        this.terminal.outputText('The specified path is not valid');
        return;
      }
      const receiver = args[1];
      const amount = args[2];
      let usage = '';

      if (args.length === 4) {
        usage = args[3];
      }

      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        this.terminal.output('<em>amount</em> is not a valid number');
      } else {
        this.fileService.getFromPath(this.activeDevice['uuid'], walletPath).subscribe(walletFile => {
          if (walletFile.is_directory) {
            this.terminal.outputText('That file does not exist');
            return;
          }

          if (walletFile.content.trim().length === 47) {
            const walletCred = walletFile.content.split(' ');
            const uuid = walletCred[0];
            const key = walletCred[1];
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
              this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe({
                next: () => {
                  this.websocket.ms('currency', ['send'], {
                    source_uuid: uuid,
                    key: key,
                    send_amount: Math.floor(parseFloat(amount) * 1000),
                    destination_uuid: receiver,
                    usage: usage
                  }).subscribe({
                    next: () => {
                      this.terminal.outputText('Successfully sent ' + amount + ' to ' + receiver);
                    }, error: (error: Error) => {
                      this.terminal.outputText(error.message);
                      reportError(error);
                    }
                  });
                }, error: () => {
                  this.terminal.outputText('That file is not connected with a wallet');
                }
              });
            } else {
              this.terminal.outputText('That file is not a wallet file');
            }
          } else {
            this.terminal.outputText('That file is not a wallet file');
          }
        }, error => {
          if (error.message === 'file_not_found') {
            this.terminal.outputText('That file does not exist');
          } else {
            reportError(error);
          }
        });
      }
    } else {
      this.terminal.outputText('usage: pay <filename> <receiver> <amount> [usage]');
    }
  }

  service(args: string[]) {
    const activeDevice = this.activeDevice['uuid'];

    const getServices = () =>
      this.websocket.ms('service', ['list'], {device_uuid: activeDevice}).pipe(map(data => {
        return data['services'];
      }), catchError(error => {
        reportError(error);
        return [];
      }));

    const getService = (name: string) => getServices().pipe(map(services => {
      return (services as any[]).find(service => service['name'] === name);
    }));

    if (args.length >= 1 && args[0].toLowerCase() === 'create') {
      if (args.length !== 2) {
        this.terminal.outputText('usage: service create <bruteforce|portscan|telnet|ssh>');
        return;
      }

      const service = args[1];
      const services = ['bruteforce', 'portscan', 'telnet', 'ssh'];
      if (!services.includes(service)) {
        this.terminal.outputText('Unknown service. Available services: ' + services.join(', '));
        return;
      }
      this.websocket.ms('service', ['create'], {name: service, device_uuid: activeDevice}).subscribe({
        next: () => {
          this.terminal.outputText('Service was created');
        },
        error: (error: string) => {
          if (error === 'already_own_this_service') {
            this.terminal.outputText('You already created this service');
          } else {
            reportError(new Error(error));
          }
        }
      });

    } else if (args.length >= 1 && args[0] === 'list') {
      if (args.length !== 1) {
        this.terminal.outputText('usage: service list');
        return;
      }

      getServices().subscribe(services => {
        if (services.length === 0) {
          this.terminal.outputText('There is no service on this device');
        } else {
          const dev = document.createElement('span');
          dev.innerHTML = '\'' + this.activeDevice['name'] + '\' (' + DefaultTerminalState.promptAppender(this.activeDevice['uuid']) + '):';

          const el = document.createElement('ul');
          el.innerHTML = services
            //TODO: Type me correct
            .map((service: any) => '<li>' + escapeHtml(service.name) + ' (<em>' +
              (service['running'] ? 'Running' : 'Offline') +
              '</em> UUID: ' + DefaultTerminalState.promptAppender(service.uuid) +
              (service['running_port'] ? (' Port: <em>' + service['running_port'] + '</em>') : '') +
              ')</li>')
            .join((''));

          this.terminal.outputNode(dev);
          this.terminal.outputNode(el);
          DefaultTerminalState.registerPromptAppenders(dev);
          DefaultTerminalState.registerPromptAppenders(el);
        }
      });
    } else if (args.length >= 1 && args[0] === 'bruteforce') {
      if (args.length !== 3) {
        this.terminal.outputText('usage: service bruteforce <target-device> <target-service>');
        return;
      }

      const [targetDevice, targetService] = args.slice(1);
      getService('bruteforce').subscribe(bruteforceService => {
        if (bruteforceService == null || bruteforceService['uuid'] == null) {
          this.terminal.outputText('You have to create a bruteforce service before you use it');
          return;
        }

        const startAttack = () => {
          this.websocket.ms('service', ['bruteforce', 'attack'], {
            service_uuid: bruteforceService['uuid'], device_uuid: activeDevice,
            target_device: targetDevice, target_service: targetService
          }).subscribe({
            next: () => {
              this.terminal.outputText('You started a bruteforce attack');
              this.terminal.pushState(new BruteforceTerminalState(this.terminal, this.domSanitizer, stop => {
                if (stop) {
                  this.executeCommand('service', ['bruteforce', targetDevice, targetService]);
                }
              }));
            },
            error: (error1: Error) => {
              if (error1.message === 'could_not_start_service') {
                this.terminal.outputText('There was an error while starting the bruteforce attack');
              } else if (error1.message === 'invalid_input_data') {
                this.terminal.outputText('The specified UUID is not valid');
              } else {
                reportError(error1);
              }
            }
          });
        };

        this.websocket.ms('service', ['bruteforce', 'status'], {
          service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
        }).subscribe({
          next: (status) => {
            const differentServiceAttacked = status['target_service'] !== targetService;
            if (differentServiceAttacked) {
              const div = document.createElement('div');
              div.innerHTML = 'The bruteforce service already attacks another device: ' +
                DefaultTerminalState.promptAppender(status['target_device']) +
                '. Stopping...';
              this.terminal.outputNode(div);
              DefaultTerminalState.registerPromptAppenders(div);
            }

            this.websocket.ms('service', ['bruteforce', 'stop'], {
              service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
            }).subscribe({
              next: (stopData) => {
                if (stopData['access'] === true) {
                  this.terminal.outputText('Access granted - use `connect <device>`');
                } else {
                  this.terminal.outputText('Access denied. The bruteforce attack was not successful');
                }

                if (differentServiceAttacked) {
                  startAttack();
                }
              },
              error: (err: Error) => {
                if (err.message === 'service_not_running') {
                  this.terminal.outputText('Target service is unreachable.');
                }
              }
            });
          },
          error: (error: Error) => {
            if (error.message === 'attack_not_running') {
              startAttack();
            } else {
              reportError(error);
            }
          }
        });
      });
    } else if (args.length >= 1 && args[0] === 'portscan') {
      if (args.length !== 2) {
        this.terminal.outputText('usage: service portscan <device>');
        return;
      }

      const targetDevice = args[1];
      getService('portscan').subscribe(portscanService => {
        if (portscanService == null || portscanService['uuid'] == null) {
          this.terminal.outputText('You have to create a portscan service before you use it');
          return;
        }

        this.websocket.ms('service', ['use'], {
          service_uuid: portscanService['uuid'], device_uuid: activeDevice,
          target_device: targetDevice
        }).subscribe(data => {
          const runningServices = data['services'];
          if (runningServices == null || !(runningServices instanceof Array) || (runningServices).length === 0) {
            this.terminal.outputText('That device doesn\'t have any running services');
            return;
          }

          this.terminal.outputText('Open ports on that device:');

          const list = document.createElement('ul');
          list.innerHTML = '<ul>' +
            (runningServices)
              .map(service =>
                '<li>' + escapeHtml(service['name']) + ' (UUID: ' +
                DefaultTerminalState.promptAppender(service['uuid']) +
                ' Port: <em>' + service['running_port'] + '</em>)</li>')
              .join('\n') +
            '</ul>';

          this.terminal.outputNode(list);
          DefaultTerminalState.registerPromptAppenders(list);
        });
      });
    } else {
      this.terminal.outputText('usage: service create|list|bruteforce|portscan');
    }
  }

  spot() {
    this.websocket.ms('device', ['device', 'spot'], {}).subscribe(random_device => {
      this.websocket.ms('service', ['list'], {'device_uuid': this.activeDevice['uuid']}).subscribe(localServices => {
        //TODO: Type me correct
        const portScanner = (localServices['services'] || []).filter((service: any) => service.name === 'portscan')[0];
        if (portScanner == null || portScanner['uuid'] == null) {
          this.terminal.outputText('\'' + random_device['name'] + '\':');
          this.terminal.outputRaw('<ul>' +
            '<li>UUID: ' + random_device['uuid'] + '</li>' +
            '<li>Services: <em class="error-text"">portscan failed</em></li>' +
            '</ul>');
          return;
        }

        this.websocket.ms('service', ['use'], {
          'device_uuid': this.activeDevice['uuid'],
          'service_uuid': portScanner['uuid'], 'target_device': random_device['uuid']
        }).subscribe({
          next: (remoteServices) => {
            this.terminal.outputText('\'' + escapeHtml(random_device['name']) + '\':');
            const list = document.createElement('ul');
            list.innerHTML = '<li>UUID: ' + DefaultTerminalState.promptAppender(random_device['uuid']) + '</li>' +
              '<li>Services:</li>' +
              '<ul>' +
              remoteServices['services']
                //TODO: Type me correct
                .map((service: any) => '<li>' + escapeHtml(service['name']) + ' (' + DefaultTerminalState.promptAppender(service['uuid']) + ')</li>')
                .join('\n') +
              '</ul>';
            this.terminal.outputNode(list);
            DefaultTerminalState.registerPromptAppenders(list);
          },
          error: (error: Error) => {
            this.terminal.output('<span class="error-text">An error occurred</span>');
            reportError(error);
            return;
          }
        });
      });
    });
  }

  connect(args: string[]) {
    if (args.length !== 1) {
      this.terminal.outputText('usage: connect <device>');
      return;
    }

    this.websocket.ms('device', ['device', 'info'], {device_uuid: args[0]}).subscribe({
      next: (infoData) => {
        this.websocket.ms('service', ['part_owner'], {device_uuid: args[0]}).subscribe({
          next: (partOwnerData) => {
            if (infoData['owner'] === this.websocket.account.uuid || partOwnerData['ok'] === true) {
              this.terminal.pushState(
                new DefaultTerminalState(
                  this.locale,
                  this.websocket,
                  this.settings,
                  this.fileService,
                  this.domSanitizer,
                  this.windowDelegate,
                  infoData,
                  this.terminal,
                  '#DD2C00'));
            } else {
              this.terminal.outputText('Access denied');
            }
          },
          error: (error: Error) => {
            this.terminal.outputText(error.message);
            reportError(error);
          }
        });
      },
      error: (error: Error) => {
        this.terminal.outputText(error.message);
        reportError(error);
      }
    });
  }

  network(args: string[]) {
    if (args.length === 1) {
      if (args[0] === 'public') {
        this.websocket.ms('network', ['public'], {}).subscribe(publicData => {
          const networks = publicData['networks'];

          if (networks != null && networks.length !== 0) {
            this.terminal.outputText('Found ' + networks.length + ' public networks: ');

            const element = document.createElement('div');
            element.innerHTML = '';

            networks.forEach((network: any) => { //TODO: Type me correct
              element.innerHTML += '<br>' + escapeHtml(network['name']) +
                ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span>';
            });

            this.terminal.outputNode(element);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            this.terminal.outputText('No public networks found');
          }
        });

        return;
      } else if (args[0] === 'list') {
        const data = {
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['member'], data).subscribe(memberData => {
          const memberNetworks = memberData['networks'];

          if (memberNetworks != null && memberNetworks.length > 0) {
            this.terminal.outputText('Found ' + memberNetworks.length + ' networks: ');
            this.terminal.outputText('');

            const element = document.createElement('div');
            element.innerHTML = '';

            memberNetworks.forEach((network: any) => { //TODO: Type me correct
              if (network['owner'] === this.activeDevice['uuid']) {
                element.innerHTML += '<span style="color: red;">' + escapeHtml(network['name']) + '</span>' +
                  ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span><br>';
              } else {
                element.innerHTML += '<span style="color: yellow;">' + escapeHtml(network['name']) + '</span>' +
                  ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span><br>';
              }
            });

            this.terminal.outputNode(element);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            this.terminal.outputText('This device is not part of a network');
          }
        });

        return;
      } else if (args[0] === 'invitations') {
        const data = {
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['invitations'], data).subscribe({
          next: (invitationsData) => {
            const invitations = invitationsData['invitations'];

            if (invitations.length === 0) {
              this.terminal.outputText('No invitations found');
            } else {
              this.terminal.outputText('Found ' + invitations.length + ' invitations: ');

              const element = document.createElement('div');
              element.innerHTML = '';

              invitations.forEach((invitation: any) => { //TODO: Type me correct
                this.websocket.ms('network', ['get'], {'uuid': invitation['network']})
                  .subscribe(network => {
                    element.innerHTML += '<br>Invitation: ' + '<span style="color: grey">' +
                      DefaultTerminalState.promptAppender(invitation['uuid']) + '</span><br>' +
                      'Network: ' + escapeHtml(network['name']) + '<br>' +
                      'Owner: ' + '<span style="color: grey">' + DefaultTerminalState.promptAppender(network['owner']) + '</span><br>';
                    DefaultTerminalState.registerPromptAppenders(element);
                  });
              });

              this.terminal.outputNode(element);
            }
          },
          error: (error: Error) => {
            if (error.message === 'no_permissions') {
              this.terminal.outputText('Access denied');
            } else {
              reportError(error);
            }
          }
        });

        return;
      }
    } else if (args.length === 2) {
      if (args[0] === 'delete') {
        const data = {
          uuid: args[1],
          device: this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['delete'], data).subscribe({
          next: () => {
            this.terminal.outputText('Network deleted');
          },
          error: () => {
            this.terminal.outputText('Access denied');
          }
        });

        return;
      } else if (args[0] === 'request') {
        const data = {
          'uuid': args[1],
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['request'], data).subscribe({
          next: (requestData) => {
            this.terminal.outputText('Request sent:');
            this.terminal.outputText(this.activeDevice['name'] + ' -> ' + requestData['network']);
          },
          error: (error: Error) => {
            if (error.message === 'network_not_found') {
              this.terminal.outputText('Network not found: ' + args[1]);
            } else if (error.message === 'already_member_of_network') {
              this.terminal.outputText('You are already a member of this network');
            } else if (error.message === 'invitation_already_exists') {
              this.terminal.outputText('You already requested to enter this network');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      } else if (args[0] === 'requests') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', ['requests'], data).subscribe({
          next: (requestsData) => {
            const requests = requestsData['requests'];

            if (requests.length === 0) {
              this.terminal.outputText('No requests found');
            } else {
              this.terminal.outputText('Found ' + requests.length + ' requests: ');

              const element = document.createElement('div');
              element.innerHTML = '';

              requests.forEach((request: any) => { //TODO: Type me correct
                element.innerHTML += '<br>Request: <span style="color: grey;">' +
                  DefaultTerminalState.promptAppender(request['uuid']) + '</span><br>' +
                  'Device: <span style="color: grey;">' +
                  DefaultTerminalState.promptAppender(request['device']) + '</span><br>';
              });

              this.terminal.outputNode(element);

              DefaultTerminalState.registerPromptAppenders(element);
            }
          },
          error: () => {
            this.terminal.outputText('Access denied');
          }
        });

        return;
      } else if (args[0] === 'accept' || args[0] === 'deny' || args[0] === 'revoke') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', [args[0]], data).subscribe({
          next: () => {
            this.terminal.outputText(args[1] + ' -> ' + args[0]);
          },
          error: (error: Error) => {
            if (error.message === 'invitation_not_found') {
              this.terminal.outputText('Invitation not found');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      } else if (args[0] === 'leave') {
        const data = {
          'uuid': args[1],
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['leave'], data).subscribe({
          next: () => this.terminal.outputText('You left the network: ' + args[1]),
          error: (err: Error) => {
            if (err.message === 'cannot_leave_own_network') {
              this.terminal.outputText('You cannot leave your own network');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      } else if (args[0] === 'info' || args[0] === 'get') {
        const data: any = {}; //TODO: Type me correct
        data[args[0] === 'info' ? 'uuid' : 'name'] = args[1];

        this.websocket.ms('network', [args[0] === 'info' ? 'get' : 'name'], data).subscribe({
          next: (getData) => {
            const element = document.createElement('div');
            element.innerHTML = 'UUID: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['uuid']) + '</span><br>';
            element.innerHTML += 'Name: ' + escapeHtml(getData['name']) + '<br>';
            element.innerHTML += 'Hidden: ' + (getData['hidden'] ? 'private' : 'public') + '<br>';
            element.innerHTML += 'Owner: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['owner']) + '</span>';

            this.terminal.outputNode(element);

            DefaultTerminalState.registerPromptAppenders(element);
          },
          error: () => {
            this.terminal.outputText('Network not found: ' + args[1]);
          }
        });

        return;
      } else if (args[0] === 'members') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', ['members'], data).subscribe({
          next: (membersData) => {
            const members = membersData['members'];

            if (members != null && members.length > 0) {
              this.terminal.outputText('Found ' + members.length + ' members: ');
              this.terminal.outputText('');

              const element = document.createElement('div');
              element.innerHTML = '';

              members.forEach((member: any) => { //TODO: Type me correct
                this.websocket.ms('device', ['device', 'info'], {'device_uuid': member['device']})
                  .subscribe(deviceData => {
                    element.innerHTML += ' <span style="color: grey">' + DefaultTerminalState.promptAppender(member['device']) + '</span> '
                      + deviceData['name'] + '<br>';
                  });
              });

              this.terminal.outputNode(element);

              DefaultTerminalState.registerPromptAppenders(element);
            } else {
              this.terminal.outputText('This network has no members');
            }
          },
          error: () => {
            this.terminal.outputText('Access denied');
          }
        });

        return;
      }
    } else if (args.length === 3) {
      if (args[0] === 'create') {
        const name = args[1];
        const mode = args[2].toLowerCase();

        if (mode === 'private' || mode === 'public') {
          const data = {
            'hidden': mode === 'private',
            'name': name,
            'device': this.activeDevice['uuid']
          };

          this.websocket.ms('network', ['create'], data).subscribe({
            next: (createData) => {
              this.terminal.outputText('Name: ' + createData['name']);
              this.terminal.outputText('Visibility: ' + (createData['hidden'] ? 'private' : 'public'));
            },
            error: (error: Error) => {
              if (error.message === 'invalid_name') {
                this.terminal.outputText('Name is invalid: Use 5 - 20 characters');
              } else if (error.message === 'name_already_in_use') {
                this.terminal.outputText('Name already in use');
              } else {
                this.terminal.outputText('Access denied');
              }
            }
          });
        } else {
          this.terminal.outputText('Please use public or private as mode');
        }

        return;
      } else if (args[0] === 'invite') {
        const data = {
          'uuid': args[1],
          'device': args[2]
        };

        this.websocket.ms('network', ['invite'], data).subscribe({
          next: () => {
            this.terminal.outputText(args[2] + ' invited to ' + args[1]);
          },
          error: (error: Error) => {
            if (error.message === 'network_not_found') {
              this.terminal.outputText('Network not found: ' + args[1]);
            } else if (error.message === 'already_member_of_network') {
              this.terminal.outputText('This device is already a member of this network');
            } else if (error.message === 'invitation_already_exists') {
              this.terminal.outputText('You already invited this device');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      } else if (args[0] === 'kick') {
        const data = {
          'uuid': args[1],
          'device': args[2]
        };

        if (data['device'] === this.activeDevice['uuid']) {
          this.terminal.outputText('You cannot kick yourself');
          return;
        }

        this.websocket.ms('network', ['kick'], data).subscribe({
          next: (kickData) => {
            if (kickData['result']) {
              this.terminal.outputText('Kicked successfully');
            } else {
              this.terminal.outputText('The device is not a member of the network');
            }
          },
          error: (error: Error) => {
            if (error.message === 'cannot_kick_owner') {
              this.terminal.outputText('You cannot kick the owner of the network');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      }
    }
    this.terminal.outputText('network list  # show all networks of this device');
    this.terminal.outputText('network public   # show all public networks');
    this.terminal.outputText('network invitations  # show invitations of a this device');
    this.terminal.outputText('network info <uuid> # show info of network');
    this.terminal.outputText('network get <name> # show info of network');
    this.terminal.outputText('network members <uuid> # show members of network');
    this.terminal.outputText('network leave <uuid> # leave a network');
    this.terminal.outputText('network delete <uuid> # delete a network');
    this.terminal.outputText('network request <uuid> # create a join request to a network');
    this.terminal.outputText('network requests <uuid> # show requests of a network');
    this.terminal.outputText('network accept <uuid> # accept an invitation or request');
    this.terminal.outputText('network deny <uuid> # accept an invitation or request');
    this.terminal.outputText('network invite <uuid> <device> # invite to network');
    this.terminal.outputText('network revoke <uuid> # revoke an invitation');
    this.terminal.outputText('network kick <uuid> <device> # kick device out of network');
    this.terminal.outputText('network create <name> <private|public>   # create a network');
  }

  info() {
    this.terminal.outputText('Username: ' + this.websocket.account.name);
    this.terminal.outputText('Host: ' + this.activeDevice['name']);

    const element = document.createElement('div');
    element.innerHTML = `Address: <span style="color: silver;">${DefaultTerminalState.promptAppender(this.activeDevice['uuid'])}</span>`;
    this.terminal.outputNode(element);

    DefaultTerminalState.registerPromptAppenders(element);
  }
}
