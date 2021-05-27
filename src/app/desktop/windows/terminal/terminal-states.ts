import {TerminalAPI, TerminalState} from './terminal-api';
import {WebsocketService} from '../../../websocket.service';
import {catchError, map} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {SecurityContext} from '@angular/core';
import {SettingsService} from '../settings/settings.service';
import {FileService} from '../../../api/files/file.service';
import {Path} from '../../../api/files/path';
import {of} from 'rxjs';
import {Device} from '../../../api/devices/device';
import {WindowDelegate} from '../../window/window-delegate';
import {File} from '../../../api/files/file';
import {Shell} from 'src/app/shell/shell';
import {ShellApi} from 'src/app/shell/shellapi';


function escapeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


export abstract class CommandTerminalState implements TerminalState {
  abstract commands: {[name: string]: {executor: (io: IOHandler) => void, description: string, hidden?: boolean}};
  protected abstract terminal: TerminalAPI;

  protocol: string[] = [];
  variables: Map<string, string> = new Map();

  // if an iohandler is given, the list of args is discarded
  executeCommand(command: string, args: string[], io: IOHandler = null) {
    const iohandler = io ? io : {
      stdout: this.stdoutHandler.bind(this),
      stdin: this.stdinHandler.bind(this),
      stderr: this.stderrHandler.bind(this),
      args: args
    };
    command = command.toLowerCase();
    // command not completed
    this.setExitCode(-1);
    if (this.commands.hasOwnProperty(command)) {
      this.commands[command].executor(iohandler);
    } else if (command !== '') {
      this.commandNotFound(command, iohandler);
    }
  }

  // wait until the command is completed => the exitCode is !== -1
  waitForCompletion() {
    const poll = (resolve: () => void) => {
      if (this.getExitCode() !== -1) {
        resolve();
      } else {
        setTimeout(_ => poll(resolve), 10);
      }
    };
    return new Promise(poll);
  }


  executeCommandChain(commands: string[], previousStdout: string = null) {
    let stdoutText = '';

    const pipedStdout = (output: Stdout) => {
      switch (output.outputType) {
        case OutputType.NODE:
          stdoutText = stdoutText + output.dataNode.toString() + '\n';
          break;
        case OutputType.RAW:
          stdoutText = stdoutText + output.data;
          break;
        case OutputType.HTML:
          stdoutText = stdoutText + output.data + '\n';
          break;
        case OutputType.TEXT:
          stdoutText = stdoutText + output.data + '\n';
          break;
      }
    };

    const pipedStdin = (callback: (input: string) => void) => {
      callback(previousStdout);
    };

    let command = commands[0].trim().split(' ');
    if (command.length === 0) {
      this.executeCommandChain(commands.slice(1));
      return;
    }
    // replace variables with their values
    command = command.map((arg) => {
      if (arg.startsWith('$')) {
        const name = arg.slice(1);
        if (this.variables.has(name)) {
          return this.variables.get(name);
        }
        return '';
      }
      return arg;
    });

    const stdout = commands.length > 1 ? pipedStdout : this.stdoutHandler.bind(this);
    const stdin = previousStdout ? pipedStdin : this.stdinHandler.bind(this);
    const iohandler: IOHandler = {stdout: stdout, stdin: stdin, stderr: this.stderrHandler.bind(this), args: command.slice(1)};
    // args are in inclued in the iohandler, we don't have to give them twice
    this.executeCommand(command[0], [], iohandler);
    this.waitForCompletion().then(() => {
      if (commands.length > 1) {
        this.executeCommandChain(commands.slice(1), stdoutText);
      }
    });
  }

  execute(cmd: string) {
    let commands = cmd.trim().split(';');
    commands = [].concat(...commands.map((command) => command.split('\n')));
    commands.forEach((command) => {
      const pipedCommands = command.trim().split('|');
      this.executeCommandChain(pipedCommands);
    });
    if (cmd) {
      this.protocol.unshift(cmd);
    }

  }

  reportError(error) {
    console.warn(new Error(error.message));
    this.setExitCode(1);
  }

  /** default implementaion for stdin: reading from console */
  stdinHandler(callback: (input: string) => void) {
    return new DefaultStdin(this.terminal).read(callback);
  }


  /** default implementaion for stderr: printing to console */
  stderrHandler(stderr: string) {
    this.terminal.output(stderr);
  }

  /** default implementaion for stdout: printing to console */
  stdoutHandler(stdout: Stdout) {
    switch (stdout.outputType) {
      case OutputType.HTML:
        this.terminal.output(stdout.data);
        break;
      case OutputType.RAW:
        this.terminal.outputRaw(stdout.data);
        break;
      case OutputType.TEXT:
        this.terminal.outputText(stdout.data);
        break;
      case OutputType.NODE:
        this.terminal.outputNode(stdout.dataNode);
        break;
    }
  }

  setExitCode(exitCode: number) {
    this.variables.set('?', String(exitCode));
  }

  getExitCode(): number {
    return Number(this.variables.get('?'));
  }

  abstract commandNotFound(command: string, iohandler: IOHandler): void;

  async autocomplete(content: string): Promise<string> {
    return content
      ? Object.entries(this.commands)
        .filter(command => !command[1].hidden)
        .map(([name]) => name)
        .sort()
        .find(n => n.startsWith(content))
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
      description: 'shows the command history of the current terminal session'
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
    'run': {
      executor: this.run.bind(this),
      description: 'run an executable file'
    },
    'set': {
      executor: this.setVariable.bind(this),
      description: 'set the value of a variable'
    },
    'echo': {
      executor: this.echo.bind(this),
      description: 'display a line of text'
    },
    'read': {
      executor: this.read.bind(this),
      description: 'read input of user'
    },
    'msh': {
      executor: this.msh.bind(this),
      description: 'create a new shell'
    },

    // easter egg
    'chaozz': {
      executor: (iohandler: IOHandler) => iohandler.stdout(Stdout.text('"mess with the best, die like the rest :D`" - chaozz')),
      description: '',
      hidden: true
    }

  };

  working_dir: string = Path.ROOT;  // UUID of the working directory

  constructor(protected websocket: WebsocketService, private settings: SettingsService, private fileService: FileService,
              private domSanitizer: DomSanitizer, protected windowDelegate: WindowDelegate, protected activeDevice: Device,
              protected terminal: TerminalAPI, public promptColor: string = null) {
    super();
  }

  static registerPromptAppenders(element: HTMLElement) {
    element
      .querySelectorAll('.promptAppender')
      .forEach(el => el.addEventListener('click', DefaultTerminalState.promptAppenderListener));
  }

  static promptAppender(value: string): string {
    return `<span class="promptAppender" style="text-decoration: underline; cursor: pointer;">${escapeHtml(value)}</span>`;
  }

  private static promptAppenderListener(evt: MouseEvent) {
    evt.stopPropagation();
    const this_ = evt.target as HTMLElement;
    const cmdline: HTMLInputElement = this_.closest('#terminal-window').querySelector('#cmdline');
    if (cmdline.selectionStart != null) {
      const startPos = cmdline.selectionStart;
      const addSpace = cmdline.selectionStart === cmdline.value.length;
      cmdline.value =
        cmdline.value.substring(0, startPos) +
        this_.innerText +
        (addSpace ? ' ' : '') +
        cmdline.value.substring(cmdline.selectionEnd);
      cmdline.focus();
      cmdline.selectionStart = startPos + this_.innerText.length + (addSpace ? 1 : 0);
      cmdline.selectionEnd = cmdline.selectionStart;
    } else {
      cmdline.value += this_.innerText + ' ';
      cmdline.focus();
    }
  }

  commandNotFound(_: string, iohandler: IOHandler) {
    iohandler.stderr('Command could not be found.\nType `help` for a list of commands.');
    this.setExitCode(127);
  }

  refreshPrompt() {
    this.fileService.getAbsolutePath(this.activeDevice['uuid'], this.working_dir).subscribe(path => {
      const color = this.domSanitizer.sanitize(SecurityContext.STYLE, this.promptColor || this.settings.getTPC());
      const prompt = this.domSanitizer.bypassSecurityTrustHtml(
        `<span style="color: ${color}">` +
        `${escapeHtml(this.websocket.account.name)}@${escapeHtml(this.activeDevice['name'])}` +
        `<span style="color: white">:</span>` +
        `<span style="color: #0089ff;">/${path.join('/')}</span>$` +
        `</span>`
      );
      this.terminal.changePrompt(prompt);
    });
  }


  help(iohandler: IOHandler) {
    const table = document.createElement('table');
    Object.entries(this.commands)
      .filter(command => !('hidden' in command[1]))
      .map(([name, value]) => ({name: name, description: value.description}))
      .map(command => `<tr><td>${command.name}</td><td>${command.description}</td></tr>`)
      .forEach(row => {
        table.innerHTML += row;
      });
    iohandler.stdout(Stdout.node(table));
    this.setExitCode(0);
  }

  miner(iohandler: IOHandler) {
    let miner;
    let wallet;
    let power;
    let text;
    const args = iohandler.args;
    if (args.length === 0) {
      iohandler.stderr('usage: miner look|wallet|power|start');
      this.setExitCode(1);
      return;
    }
    switch (args[0]) {
      case 'look':
        this.websocket.ms('service', ['list'], {
          'device_uuid': this.activeDevice['uuid'],
        }).subscribe((listData) => {
          listData.services.forEach((service) => {
            if (service.name === 'miner') {
              miner = service;
              this.websocket.ms('service', ['miner', 'get'], {
                'service_uuid': miner.uuid,
              }).subscribe(data => {
                wallet = data['wallet'];
                power = Math.round(data['power'] * 100);
                text =
                  'Wallet: ' + wallet + '<br>' +
                  'Mining Speed: ' + String(Number(miner.speed) * 60 * 60) + ' MC/h<br>' +
                  'Power: ' + power + '%';
                iohandler.stdout(Stdout.html(text));
                this.setExitCode(0);
              });
            }
          });
        });
        break;
      case 'wallet':
        if (args.length !== 2) {
          iohandler.stderr('usage: miner wallet <wallet-id>');
          this.setExitCode(1);
          return;
        }
        this.websocket.ms('service', ['list'], {
          'device_uuid': this.activeDevice['uuid'],
        }).subscribe((listData) => {
          listData.services.forEach((service) => {
            if (service.name === 'miner') {
              miner = service;
              this.websocket.ms('service', ['miner', 'wallet'], {
                'service_uuid': miner.uuid,
                'wallet_uuid': args[1],
              }).subscribe((walletData) => {
                wallet = args[1];
                power = walletData.power;
                iohandler.stdout(Stdout.text(`Set wallet to ${args[1]}`));
                this.setExitCode(0);
              }, () => {
                iohandler.stderr('Wallet is invalid.');
                this.setExitCode(1);
              });
            }
          });
        });
        break;
      case 'power':
        if (args.length !== 2 || isNaN(Number(args[1])) || 0 > Number(args[1]) || Number(args[1]) > 100) {
          iohandler.stderr('usage: miner power <0-100>');
          this.setExitCode(1);
        }
        this.websocket.ms('service', ['list'], {
          'device_uuid': this.activeDevice['uuid'],
        }).subscribe((listData) => {
          listData.services.forEach((service) => {
            if (service.name === 'miner') {
              miner = service;
              this.websocket.ms('service', ['miner', 'power'], {
                'service_uuid': miner.uuid,
                'power': Number(args[1]) / 100,
              }).subscribe((_: {power: number}) => {
                iohandler.stdout(Stdout.text('Set Power to ' + args[1] + '%'));
                this.setExitCode(0);
              });
            }
          });
        });
        break;
      case 'start':
        if (args.length !== 2) {
          iohandler.stderr('usage: miner start <wallet-id>');
          this.setExitCode(1);
          return;
        }
        this.websocket.ms('service', ['create'], {
          'device_uuid': this.activeDevice['uuid'],
          'name': 'miner',
          'wallet_uuid': args[1],
        }).subscribe((service) => {
          miner = service;
          this.setExitCode(0);
        }, () => {
          iohandler.stderr('Invalid wallet');
          this.setExitCode(1);
        });
        break;
      default:
        iohandler.stderr('usage: miner look|wallet|power|start');
        this.setExitCode(1);
    }
  }

  status(iohandler: IOHandler) {
    this.websocket.request({
      action: 'info'
    }).subscribe(r => {
      iohandler.stdout(Stdout.text('Online players: ' + r.online));
      this.setExitCode(0);
    });
  }

  hostname(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      const hostname = args[0];
      this.websocket.ms('device', ['device', 'change_name'], {
        device_uuid: this.activeDevice['uuid'],
        name: hostname
      }).subscribe(newDevice => {
        this.activeDevice = newDevice;
        this.refreshPrompt();

        if (this.activeDevice.uuid === this.windowDelegate.device.uuid) {
          Object.assign(this.windowDelegate.device, newDevice);
        }
        this.setExitCode(0);
      }, () => {
        iohandler.stderr('The hostname couldn\'t be changed');
        this.setExitCode(1);
      });
    } else {
      this.websocket.ms('device', ['device', 'info'], {device_uuid: this.activeDevice['uuid']}).subscribe(device => {
        if (device['name'] !== this.activeDevice['name']) {
          this.activeDevice = device;
          this.refreshPrompt();
        }
        iohandler.stdout(Stdout.text(device['name']));
        this.setExitCode(0);
      }, () => {
        iohandler.stdout(Stdout.text(this.activeDevice['name']));
        this.setExitCode(0);
      });
    }
  }

  cd(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }
      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(file => {
        if (file.is_directory) {
          this.working_dir = file.uuid;
          this.refreshPrompt();
          this.setExitCode(0);
        } else {
          iohandler.stderr('That is not a directory');
          this.setExitCode(1);
        }
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That directory does not exist');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });
    }
  }

  list_files(files: File[], iohandler: IOHandler) {
    files.filter((file) => {
      return file.is_directory;
    }).sort().forEach(folder => {
      iohandler.stdout(Stdout.html(`<span style="color: ${this.settings.getLSFC()};">${(this.settings.getLSPrefix()) ? '[Folder] ' : ''}${folder.filename}</span>`));
    });

    files.filter((file) => {
      return !file.is_directory;
    }).sort().forEach(file => {
      iohandler.stdout(Stdout.text(`${(this.settings.getLSPrefix() ? '[File] ' : '')}${file.filename}`));
    });
    this.setExitCode(0);
  }

  ls(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 0) {
      this.fileService.getFiles(this.activeDevice['uuid'], this.working_dir).subscribe(files => {
        this.list_files(files, iohandler);
      });
    } else if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(target => {
        if (target.is_directory) {
          this.fileService.getFiles(this.activeDevice['uuid'], target.uuid).subscribe(files => {
            this.list_files(files, iohandler);
          });
        } else {
          this.list_files([target], iohandler);
        }
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That directory does not exist');
          this.setExitCode(2);
        } else {
          this.reportError(error);
        }
      });
    } else {
      iohandler.stderr('usage: ls [directory]');
      this.setExitCode(1);
    }
  }

  touch(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length >= 1) {
      const filename = args[0];
      let content = '';

      if (!filename.match(/^[a-zA-Z0-9.\-_]+$/)) {
        iohandler.stderr('That filename is not valid');
        this.setExitCode(1);
        return;
      }

      if (filename.length > 64) {
        iohandler.stderr('That filename is too long');
        this.setExitCode(1);
        return;
      }

      if (args.length > 1) {
        content = args.slice(1).join(' ');
      }

      this.fileService.createFile(this.activeDevice['uuid'], filename, content, this.working_dir).subscribe(
        _ => this.setExitCode(0),
        err => {
          if (err.message === 'file_already_exists') {
            iohandler.stderr('That file already exists');
            this.setExitCode(1);
          } else {
            this.reportError(err);
          }
        });
    } else {
      iohandler.stderr('usage: touch <filename> [content]');
      this.setExitCode(1);
    }
  }

  cat(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(file => {
        if (file.is_directory) {
          iohandler.stderr('That is not a file');
          this.setExitCode(1);
        } else {
          const lines = file.content.split('\n');
          lines.forEach((line) =>
            iohandler.stdout(Stdout.text(line))
          );
          this.setExitCode(0);
        }
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That file does not exist');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });
    } else {
      iohandler.stderr('usage: cat <filename>');
      this.setExitCode(1);
    }
  }

  rm(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(file => {
        const deleteFile = () => {
          this.websocket.ms('device', ['file', 'delete'], {
            device_uuid: this.activeDevice['uuid'],
            file_uuid: file.uuid
          });
          this.setExitCode(0);
        };
        if (file.content.trim().length === 47) {
          const walletCred = file.content.split(' ');
          const uuid = walletCred[0];
          const key = walletCred[1];
          if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
            this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe(() => {
              this.terminal.pushState(
                new YesNoTerminalState(
                  this.terminal,
                  '<span class="errorText">Are you sure you want to delete your wallet? [yes|no]</span>',
                  answer => {
                    if (answer) {
                      this.websocket.ms('currency', ['delete'], {source_uuid: uuid, key: key}).subscribe(() => {
                        this.websocket.ms('device', ['file', 'delete'], {
                          device_uuid: this.activeDevice['uuid'],
                          file_uuid: file.uuid
                        });
                        this.setExitCode(0);
                      }, error => {
                        iohandler.stderr('<span class="errorText"">The wallet couldn\'t be deleted successfully. ' +
                          'Please report this bug.</span>');
                        this.setExitCode(1);
                        this.reportError(error);
                      });
                    }
                  }
                )
              );
            }, () => deleteFile());
          } else {
            deleteFile();
          }
        } else {
          deleteFile();
        }
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That file does not exist');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });
    } else {
      iohandler.stderr('usage: rm <filename>');
      this.setExitCode(1);
    }
  }

  cp(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 2) {
      let srcPath: Path;
      let destPath: Path;
      try {
        srcPath = Path.fromString(args[0], this.working_dir);
        destPath = Path.fromString(args[1], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }
      const deviceUUID = this.activeDevice['uuid'];

      this.fileService.getFromPath(deviceUUID, srcPath).subscribe(source => {
        this.fileService.copyFile(source, destPath).subscribe(
          _ => this.setExitCode(0),
          error => {
            if (error.message === 'file_already_exists') {
              iohandler.stderr('That file already exists');
            } else if (error.message === 'cannot_copy_directory') {
              iohandler.stderr('Cannot copy directories');
            } else if (error.message === 'destination_not_found') {
              iohandler.stderr('The destination folder was not found');
            } else {
              this.reportError(error);
            }
            this.setExitCode(1);
          });
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That file does not exist');
          this.setExitCode(1);
        }
      });

    } else {
      iohandler.stderr('usage: cp <source> <destination>');
      this.setExitCode(1);
    }
  }

  mv(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 2) {
      let srcPath: Path;
      let destPath: Path;
      try {
        srcPath = Path.fromString(args[0], this.working_dir);
        destPath = Path.fromString(args[1], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], srcPath).subscribe(source => {
        if (source.is_directory) {
          iohandler.stderr('You cannot move directories');
          this.setExitCode(1);
          return;
        }
        this.fileService.moveToPath(source, destPath).subscribe(
          _ => this.setExitCode(0),
          err => {
            if (err.message === 'destination_is_file') {
              iohandler.stderr('The destination must be a directory');
              this.setExitCode(1);
            } else if (err.message === 'file_already_exists') {
              iohandler.stderr('A file with the specified name already exists in the destination directory');
              this.setExitCode(1);
            } else if (err.message === 'file_not_found') {
              iohandler.stderr('The destination directory does not exist');
              this.setExitCode(1);
            } else {
              this.reportError(err);
            }
          });
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That file does not exist');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });

    } else {
      iohandler.stderr('usage: mv <source> <destination>');
      this.setExitCode(1);
    }
  }

  rename(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 2) {
      let filePath: Path;
      try {
        filePath = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      const name = args[1];

      if (!name.match(/^[a-zA-Z0-9.\-_]+$/)) {
        iohandler.stderr('That name is not valid');
        this.setExitCode(1);
        return;
      }

      if (name.length > 64) {
        iohandler.stderr('That name is too long');
        this.setExitCode(1);
        return;
      }

      this.fileService.getFromPath(this.activeDevice['uuid'], filePath).subscribe(file => {
        this.fileService.rename(file, name).subscribe(
          _ => this.setExitCode(0),
          err => {
            if (err.message === 'file_already_exists') {
              iohandler.stderr('A file with the specified name already exists');
              this.setExitCode(1);
            } else {
              this.reportError(err);
            }
          });
      }, error => {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That file does not exist');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });

    } else {
      iohandler.stderr('usage: rename <file> <new name>');
      this.setExitCode(1);
    }
  }

  mkdir(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      const dirname = args[0];
      if (!dirname.match(/^[a-zA-Z0-9.\-_]+$/)) {
        iohandler.stderr('That directory name is not valid');
        this.setExitCode(1);
        return;
      }

      if (dirname.length > 64) {
        iohandler.stderr('That directory name is too long');
        this.setExitCode(1);
        return;
      }

      this.fileService.createDirectory(this.activeDevice['uuid'], dirname, this.working_dir).subscribe(
        _ => this.setExitCode(0),
        err => {
          if (err.message === 'file_already_exists') {
            iohandler.stderr('A file with the specified name already exists');
            this.setExitCode(1);
          } else {
            this.reportError(err);
          }
        });
    } else {
      iohandler.stderr('usage: mkdir <directory>');
      this.setExitCode(1);
    }
  }

  exit() {
    this.terminal.popState();
    this.setExitCode(0);
  }

  clear() {
    this.terminal.clear();
    this.setExitCode(0);
  }

  history(iohandler: IOHandler) {
    const l = this.getHistory();

    l.reverse();

    l.forEach(e => {
      iohandler.stdout(Stdout.text(e));
    });
    this.setExitCode(0);
  }

  morphcoin(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 2) {
      if (args[0] === 'reset') {
        this.websocket.ms('currency', ['reset'], {source_uuid: args[1]}).subscribe(
          () => {
            iohandler.stdout(Stdout.text('Wallet has been deleted successfully.'));
            this.setExitCode(0);
          },
          error => {
            if (error.message === 'permission_denied') {
              iohandler.stderr('Permission denied.');
            } else {
              iohandler.stderr('Wallet does not exist.');
            }
            this.setExitCode(1);
          }
        );
        return;
      }

      let path: Path;
      try {
        path = Path.fromString(args[1], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }

      if (args[0] === 'look') {
        this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(file => {
          if (file.is_directory) {
            iohandler.stderr('That file does not exist');
            this.setExitCode(1);
            return;
          }

          if (file.content.trim().length === 47) {
            const walletCred = file.content.split(' ');
            const uuid = walletCred[0];
            const key = walletCred[1];
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
              this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe(wallet => {
                iohandler.stdout(Stdout.text(new Intl.NumberFormat().format(wallet.amount / 1000) + ' morphcoin'));
                this.setExitCode(0);
              }, () => {
                iohandler.stderr('That file is not connected with a wallet');
                this.setExitCode(1);
              });
            } else {
              iohandler.stderr('That file is not a wallet file');
              this.setExitCode(1);
            }
          } else {
            iohandler.stderr('That file is not a wallet file');
            this.setExitCode(1);
          }
        }, error => {
          if (error.message === 'file_not_found') {
            iohandler.stderr('That file does not exist');
            this.setExitCode(1);
          } else {
            this.reportError(error);
          }
        });

      } else if (args[0] === 'create') {
        (path.path.length > 1
          ? this.fileService.getFromPath(this.activeDevice['uuid'], new Path(path.path.slice(0, -1), path.parentUUID))
          : of({uuid: path.parentUUID})
        ).subscribe(dest => {
          this.fileService.getFromPath(this.activeDevice['uuid'], new Path(path.path.slice(-1), dest.uuid)).subscribe(() => {
            iohandler.stderr('That file already exists');
            this.setExitCode(1);
          }, error => {
            if (error.message === 'file_not_found') {
              if (path.path[path.path.length - 1].length < 65) {
                this.websocket.ms('currency', ['create'], {}).subscribe(wallet => {
                  const credentials = wallet.source_uuid + ' ' + wallet.key;

                  this.fileService.createFile(
                    this.activeDevice['uuid'],
                    path.path[path.path.length - 1],
                    credentials,
                    this.working_dir
                  )
                    .subscribe(
                      _ => this.setExitCode(0),
                      err => {
                        iohandler.stderr('That file touldn\'t be created. Please note your wallet credentials ' +
                          'and put them in a new file with \'touch\' or contact the support: \'' + credentials + '\'');
                        this.setExitCode(1);
                        this.reportError(err);
                      });
                }, error1 => {
                  if (error1.message === 'already_own_a_wallet') {
                    iohandler.stderr('You already own a wallet');
                  } else {
                    iohandler.stderr(error1.message);
                    this.reportError(error1);
                  }
                  this.setExitCode(1);
                });
              } else {
                iohandler.stderr('Filename too long. Only 64 chars allowed');
                this.setExitCode(1);
              }
            } else {
              this.reportError(error);
            }
          });
        }, error => {
          if (error.message === 'file_not_found') {
            iohandler.stderr('That path does not exist');
            this.setExitCode(1);
          } else {
            this.reportError(error);
          }
        });
      }
    } else if (args.length === 1 && args[0] === 'list') {
      this.websocket.ms('currency', ['list'], {}).subscribe(data => {
        if (data.wallets.length === 0) {
          iohandler.stderr('You don\'t own any wallet.');
          this.setExitCode(1);
        } else {
          iohandler.stdout(Stdout.text('Your wallets:'));

          const el = document.createElement('ul');
          el.innerHTML = data.wallets
            .map(wallet => '<li>' + DefaultTerminalState.promptAppender(wallet) + '</li>')
            .join((''));

          iohandler.stdout(Stdout.node(el));
          DefaultTerminalState.registerPromptAppenders(el);
          this.setExitCode(0);
        }
      });
    } else {
      iohandler.stderr('usage: morphcoin look|create|list|reset [<filename>|<uuid>]');
      this.setExitCode(1);
    }
  }

  pay(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 3 || args.length === 4) {
      let walletPath: Path;
      try {
        walletPath = Path.fromString(args[0], this.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        this.setExitCode(1);
        return;
      }
      const receiver = args[1];
      const amount = args[2];
      let usage = '';

      if (args.length === 4) {
        usage = args[3];
      }

      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        iohandler.stderr('<em>amount</em> is not a valid number');
        this.setExitCode(1);
      } else {
        this.fileService.getFromPath(this.activeDevice['uuid'], walletPath).subscribe(walletFile => {
          if (walletFile.is_directory) {
            iohandler.stderr('That file does not exist');
            this.setExitCode(1);
            return;
          }

          if (walletFile.content.trim().length === 47) {
            const walletCred = walletFile.content.split(' ');
            const uuid = walletCred[0];
            const key = walletCred[1];
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/) && key.match(/^[a-f0-9]{10}$/)) {
              this.websocket.ms('currency', ['get'], {source_uuid: uuid, key: key}).subscribe(() => {
                this.websocket.ms('currency', ['send'], {
                  source_uuid: uuid,
                  key: key,
                  send_amount: Math.floor(parseFloat(amount) * 1000),
                  destination_uuid: receiver,
                  usage: usage
                }).subscribe(() => {
                  iohandler.stdout(Stdout.text('Successfully sent ' + amount + ' to ' + receiver));
                  this.setExitCode(0);
                }, error => {
                  iohandler.stderr(error.message);
                  this.reportError(error);
                });
              }, () => {
                iohandler.stderr('That file is not connected with a wallet');
                this.setExitCode(1);
              });
            } else {
              iohandler.stderr('That file is not a wallet file');
              this.setExitCode(1);
            }
          } else {
            iohandler.stderr('That file is not a wallet file');
            this.setExitCode(1);
          }
        }, error => {
          if (error.message === 'file_not_found') {
            iohandler.stderr('That file does not exist');
            this.setExitCode(1);
          } else {
            this.reportError(error);
          }
        });
      }
    } else {
      iohandler.stderr('usage: pay <filename> <receiver> <amount> [usage]');
      this.setExitCode(1);
    }
  }

  service(iohandler: IOHandler) {
    const args = iohandler.args;
    const activeDevice = this.activeDevice['uuid'];

    const getServices = () =>
      this.websocket.ms('service', ['list'], {device_uuid: activeDevice}).pipe(map(data => {
        return data['services'];
      }), catchError(error => {
        this.reportError(error);
        return [];
      }));

    const getService = name => getServices().pipe(map(services => {
      return (services as any[]).find(service => service['name'] === name);
    }));

    if (args.length >= 1 && args[0].toLowerCase() === 'create') {
      if (args.length !== 2) {
        iohandler.stderr('usage: service create <bruteforce|portscan|telnet|ssh>');
        this.setExitCode(1);
        return;
      }

      const service = args[1];
      const services = ['bruteforce', 'portscan', 'telnet', 'ssh'];
      if (!services.includes(service)) {
        iohandler.stderr('Unknown service. Available services: ' + services.join(', '));
        this.setExitCode(1);
        return;
      }
      this.websocket.ms('service', ['create'], {name: service, device_uuid: activeDevice}).subscribe(() => {
        iohandler.stdout(Stdout.text('Service was created'));
        this.setExitCode(0);
      }, error => {
        if (error === 'already_own_this_service') {
          iohandler.stderr('You already created this service');
          this.setExitCode(1);
        } else {
          this.reportError(error);
        }
      });
    } else if (args.length >= 1 && args[0] === 'list') {
      if (args.length !== 1) {
        iohandler.stderr('usage: service list');
        this.setExitCode(1);
        return;
      }

      getServices().subscribe(services => {
        if (services.length === 0) {
          iohandler.stderr('There is no service on this device');
          this.setExitCode(1);
        } else {
          const dev = document.createElement('span');
          dev.innerHTML = '\'' + this.activeDevice['name'] + '\' ('
            + DefaultTerminalState.promptAppender(this.activeDevice['uuid']) + '):';

          const el = document.createElement('ul');
          el.innerHTML = services
            .map(service => '<li>' + escapeHtml(service.name) + ' (<em>' +
              (service['running'] ? 'Running' : 'Offline') +
              '</em> UUID: ' + DefaultTerminalState.promptAppender(service.uuid) +
              (service['running_port'] ? (' Port: <em>' + service['running_port'] + '</em>') : '') +
              ')</li>')
            .join((''));

          iohandler.stdout(Stdout.node(dev));
          iohandler.stdout(Stdout.node(el));
          DefaultTerminalState.registerPromptAppenders(dev);
          DefaultTerminalState.registerPromptAppenders(el);
          this.setExitCode(0);
        }
      });
    } else if (args.length >= 1 && args[0] === 'bruteforce') {
      if (args.length !== 3) {
        iohandler.stderr('usage: service bruteforce <target-device> <target-service>');
        this.setExitCode(1);
        return;
      }

      const [targetDevice, targetService] = args.slice(1);
      getService('bruteforce').subscribe(bruteforceService => {
        if (bruteforceService == null || bruteforceService['uuid'] == null) {
          iohandler.stderr('You have to create a bruteforce service before you use it');
          this.setExitCode(1);
          return;
        }

        const startAttack = () => {
          this.websocket.ms('service', ['bruteforce', 'attack'], {
            service_uuid: bruteforceService['uuid'], device_uuid: activeDevice,
            target_device: targetDevice, target_service: targetService
          }).subscribe(() => {
            iohandler.stdout(Stdout.text('You started a bruteforce attack'));
            this.terminal.pushState(new BruteforceTerminalState(this.terminal, this.domSanitizer, stop => {
              if (stop) {
                this.executeCommand('service', ['bruteforce', targetDevice, targetService]);
                this.setExitCode(0);
              }
            }));
          }, error1 => {
            if (error1.message === 'could_not_start_service') {
              iohandler.stderr('There was an error while starting the bruteforce attack');
            } else if (error1.message === 'invalid_input_data') {
              iohandler.stderr('The specified UUID is not valid');
            } else {
              this.reportError(error1);
            }
            this.setExitCode(1);
          });
        };

        this.websocket.ms('service', ['bruteforce', 'status'], {
          service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
        }).subscribe(status => {
          const differentServiceAttacked = status['target_service'] !== targetService;
          if (differentServiceAttacked) {
            const div = document.createElement('div');
            div.innerHTML = 'The bruteforce service already attacks another device: ' +
              DefaultTerminalState.promptAppender(status['target_device']) +
              '. Stopping...';
            iohandler.stdout(Stdout.node(div));
            DefaultTerminalState.registerPromptAppenders(div);
            this.setExitCode(255);
          }

          this.websocket.ms('service', ['bruteforce', 'stop'], {
            service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
          }).subscribe(stopData => {
            if (stopData['access'] === true) {
              iohandler.stdout(Stdout.text('Access granted - use `connect <device>`'));
              this.setExitCode(0);
            } else {
              iohandler.stderr('Access denied. The bruteforce attack was not successful');
              this.setExitCode(255);
            }

            if (differentServiceAttacked) {
              startAttack();
            }
          }, (err) => {
            if (err.message === 'service_not_running') {
              iohandler.stderr('Target service is unreachable.');
              this.setExitCode(255);
            }
          });
        }, error => {
          if (error.message === 'attack_not_running') {
            startAttack();
          } else {
            this.reportError(error);
          }
        });
      });
    } else if (args.length >= 1 && args[0] === 'portscan') {
      if (args.length !== 2) {
        iohandler.stderr('usage: service portscan <device>');
        this.setExitCode(1);
        return;
      }

      const targetDevice = args[1];
      getService('portscan').subscribe(portscanService => {
        if (portscanService == null || portscanService['uuid'] == null) {
          iohandler.stderr('You have to create a portscan service before you use it');
          this.setExitCode(1);
          return;
        }

        this.websocket.ms('service', ['use'], {
          service_uuid: portscanService['uuid'], device_uuid: activeDevice,
          target_device: targetDevice
        }).subscribe(data => {
          const runningServices = data['services'];
          if (runningServices == null || !(runningServices instanceof Array) || (runningServices as any[]).length === 0) {
            iohandler.stderr('That device doesn\'t have any running services');
            this.setExitCode(1);
            return;
          }

          iohandler.stdout(Stdout.text('Open ports on that device:'));

          const list = document.createElement('ul');
          list.innerHTML = '<ul>' +
            (runningServices as any[])
              .map(service =>
                '<li>' + escapeHtml(service['name']) + ' (UUID: ' +
                DefaultTerminalState.promptAppender(service['uuid']) +
                ' Port: <em>' + service['running_port'] + '</em>)</li>')
              .join('\n') +
            '</ul>';

          iohandler.stdout(Stdout.node(list));
          DefaultTerminalState.registerPromptAppenders(list);
          this.setExitCode(0);
        });
      });
    } else {
      iohandler.stderr('usage: service create|list|bruteforce|portscan');
      this.setExitCode(1);
    }
  }

  spot(iohandler: IOHandler) {
    this.websocket.ms('device', ['device', 'spot'], {}).subscribe(random_device => {
      this.websocket.ms('service', ['list'], {'device_uuid': this.activeDevice['uuid']}).subscribe(localServices => {
        const portScanner = (localServices['services'] || []).filter(service => service.name === 'portscan')[0];
        if (portScanner == null || portScanner['uuid'] == null) {
          iohandler.stderr('\'' + random_device['name'] + '\':');
          iohandler.stderr('<ul>' +
            '<li>UUID: ' + random_device['uuid'] + '</li>' +
            '<li>Services: <em class="errorText"">portscan failed</em></li>' +
            '</ul>');
          this.setExitCode(1);
          return;
        }

        this.websocket.ms('service', ['use'], {
          'device_uuid': this.activeDevice['uuid'],
          'service_uuid': portScanner['uuid'], 'target_device': random_device['uuid']
        }).subscribe(remoteServices => {
          iohandler.stdout(Stdout.text('\'' + escapeHtml(random_device['name']) + '\':'));
          const list = document.createElement('ul');
          list.innerHTML = '<li>UUID: ' + DefaultTerminalState.promptAppender(random_device['uuid']) + '</li>' +
            '<li>Services:</li>' +
            '<ul>' +
            remoteServices['services']
              .map(service => '<li>' + escapeHtml(service['name']) + ' ('
                + DefaultTerminalState.promptAppender(service['uuid']) + ')</li>')
              .join('\n') +
            '</ul>';
          iohandler.stdout(Stdout.node(list));
          DefaultTerminalState.registerPromptAppenders(list);
          this.setExitCode(0);
        }, error => {
          iohandler.stderr('<span class="errorText">An error occurred</span>');
          this.reportError(error);
          return;
        });
      });
    });
  }

  connect(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length !== 1) {
      iohandler.stderr('usage: connect <device>');
      this.setExitCode(1);
      return;
    }

    this.websocket.ms('device', ['device', 'info'], {device_uuid: args[0]}).subscribe(infoData => {
      this.websocket.ms('service', ['part_owner'], {device_uuid: args[0]}).subscribe(partOwnerData => {
        if (infoData['owner'] === this.websocket.account.uuid || partOwnerData['ok'] === true) {
          this.terminal.pushState(new DefaultTerminalState(this.websocket, this.settings, this.fileService, this.domSanitizer,
            this.windowDelegate, infoData, this.terminal, '#DD2C00'));
          this.setExitCode(0);
        } else {
          iohandler.stderr('Access denied');
          this.setExitCode(255);
        }
      }, error => {
        iohandler.stderr(error.message);
        this.reportError(error);
      });
    }, error => {
      iohandler.stderr(error.message);
      this.reportError(error);
    });
  }

  network(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 1) {
      if (args[0] === 'public') {
        this.websocket.ms('network', ['public'], {}).subscribe(publicData => {
          const networks = publicData['networks'];

          if (networks != null && networks.length !== 0) {
            iohandler.stdout(Stdout.text('Found ' + networks.length + ' public networks: '));

            const element = document.createElement('div');
            element.innerHTML = '';

            networks.forEach(network => {
              element.innerHTML += '<br>' + escapeHtml(network['name']) +
                ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span>';
            });

            iohandler.stdout(Stdout.node(element));
            this.setExitCode(0);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            iohandler.stderr('No public networks found');
            this.setExitCode(1);
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
            iohandler.stdout(Stdout.text('Found ' + memberNetworks.length + ' networks: '));
            iohandler.stdout(Stdout.text(''));

            const element = document.createElement('div');
            element.innerHTML = '';

            memberNetworks.forEach(network => {
              if (network['owner'] === this.activeDevice['uuid']) {
                element.innerHTML += '<span style="color: red;">' + escapeHtml(network['name']) + '</span>' +
                  ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span><br>';
              } else {
                element.innerHTML += '<span style="color: yellow;">' + escapeHtml(network['name']) + '</span>' +
                  ' <span style="color: grey">' + DefaultTerminalState.promptAppender(network['uuid']) + '</span><br>';
              }
            });

            iohandler.stdout(Stdout.node(element));
            this.setExitCode(0);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            iohandler.stderr('This device is not part of a network');
            this.setExitCode(1);
          }
        });

        return;
      } else if (args[0] === 'invitations') {
        const data = {
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['invitations'], data).subscribe(invitationsData => {
          const invitations = invitationsData['invitations'];

          if (invitations.length === 0) {
            iohandler.stderr('No invitations found');
            this.setExitCode(1);
          } else {
            iohandler.stdout(Stdout.text('Found ' + invitations.length + ' invitations: '));

            const element = document.createElement('div');
            element.innerHTML = '';

            invitations.forEach(invitation => {
              this.websocket.ms('network', ['get'], {'uuid': invitation['network']}).subscribe(network => {
                element.innerHTML += '<br>Invitation: ' + '<span style="color: grey">' +
                  DefaultTerminalState.promptAppender(invitation['uuid']) + '</span><br>' +
                  'Network: ' + escapeHtml(network['name']) + '<br>' +
                  'Owner: ' + '<span style="color: grey">' + DefaultTerminalState.promptAppender(network['owner']) + '</span><br>';
                DefaultTerminalState.registerPromptAppenders(element);
              });
            });

            iohandler.stdout(Stdout.node(element));
            this.setExitCode(0);
          }
        }, error => {
          if (error.message === 'no_permissions') {
            iohandler.stderr('Access denied');
          } else {
            this.reportError(error);
          }
          this.setExitCode(1);
        });

        return;
      }
    } else if (args.length === 2) {
      if (args[0] === 'delete') {
        const data = {
          uuid: args[1],
          device: this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['delete'], data).subscribe(() => {
          iohandler.stdout(Stdout.text('Network deleted'));
          this.setExitCode(0);
        }, () => {
          iohandler.stderr('Access denied');
          this.setExitCode(255);
        });

        return;
      } else if (args[0] === 'request') {
        const data = {
          'uuid': args[1],
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['request'], data).subscribe(requestData => {
          iohandler.stdout(Stdout.text('Request sent:'));
          iohandler.stdout(Stdout.text(this.activeDevice['name'] + ' -> ' + requestData['network']));
          this.setExitCode(0);
        }, error => {
          if (error.message === 'network_not_found') {
            iohandler.stderr('Network not found: ' + args[1]);
          } else if (error.message === 'already_member_of_network') {
            iohandler.stderr('You are already a member of this network');
          } else if (error.message === 'invitation_already_exists') {
            iohandler.stderr('You already requested to enter this network');
          } else {
            iohandler.stderr('Access denied');
          }
          this.setExitCode(1);
        });

        return;
      } else if (args[0] === 'requests') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', ['requests'], data).subscribe(requestsData => {
          const requests = requestsData['requests'];

          if (requests.length === 0) {
            iohandler.stderr('No requests found');
            this.setExitCode(1);
          } else {
            iohandler.stdout(Stdout.text('Found ' + requests.length + ' requests: '));

            const element = document.createElement('div');
            element.innerHTML = '';

            requests.forEach(request => {
              element.innerHTML += '<br>Request: <span style="color: grey;">' +
                DefaultTerminalState.promptAppender(request['uuid']) + '</span><br>' +
                'Device: <span style="color: grey;">' +
                DefaultTerminalState.promptAppender(request['device']) + '</span><br>';
            });

            iohandler.stdout(Stdout.node(element));
            this.setExitCode(0);

            DefaultTerminalState.registerPromptAppenders(element);
          }
        }, () => {
          iohandler.stderr('Access denied');
          this.setExitCode(255);
        });

        return;
      } else if (args[0] === 'accept' || args[0] === 'deny' || args[0] === 'revoke') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', [args[0]], data).subscribe(() => {
          iohandler.stdout(Stdout.text(args[1] + ' -> ' + args[0]));
          this.setExitCode(0);
        }, error => {
          if (error.message === 'invitation_not_found') {
            iohandler.stderr('Invitation not found');
            this.setExitCode(1);
          } else {
            iohandler.stderr('Access denied');
            this.setExitCode(255);
          }
        });

        return;
      } else if (args[0] === 'leave') {
        const data = {
          'uuid': args[1],
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['leave'], data).subscribe(() => {
          iohandler.stdout(Stdout.text('You left the network: ' + args[1]));
          this.setExitCode(0);
        }, error => {
          if (error.message === 'cannot_leave_own_network') {
            iohandler.stderr('You cannot leave your own network');
            this.setExitCode(1);
          } else {
            iohandler.stderr('Access denied');
            this.setExitCode(255);
          }
        });

        return;
      } else if (args[0] === 'info' || args[0] === 'get') {
        const data = {};
        data[args[0] === 'info' ? 'uuid' : 'name'] = args[1];

        this.websocket.ms('network', [args[0] === 'info' ? 'get' : 'name'], data).subscribe(getData => {
          const element = document.createElement('div');
          element.innerHTML = 'UUID: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['uuid']) + '</span><br>';
          element.innerHTML += 'Name: ' + escapeHtml(getData['name']) + '<br>';
          element.innerHTML += 'Hidden: ' + (getData['hidden'] ? 'private' : 'public') + '<br>';
          element.innerHTML += 'Owner: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['owner']) + '</span>';

          iohandler.stdout(Stdout.node(element));
          this.setExitCode(0);

          DefaultTerminalState.registerPromptAppenders(element);
        }, () => {
          iohandler.stderr('Network not found: ' + args[1]);
          this.setExitCode(1);
        });

        return;
      } else if (args[0] === 'members') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', ['members'], data).subscribe(membersData => {
          const members = membersData['members'];

          if (members != null && members.length > 0) {
            iohandler.stdout(Stdout.text('Found ' + members.length + ' members: '));
            iohandler.stdout(Stdout.text(''));

            const element = document.createElement('div');
            element.innerHTML = '';

            members.forEach(member => {
              this.websocket.ms('device', ['device', 'info'], {'device_uuid': member['device']}).subscribe(deviceData => {
                element.innerHTML += ' <span style="color: grey">' + DefaultTerminalState.promptAppender(member['device']) + '</span> '
                  + deviceData['name'] + '<br>';
              });
            });

            iohandler.stdout(Stdout.node(element));
            this.setExitCode(0);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            iohandler.stderr('This network has no members');
            this.setExitCode(1);
          }
        }, () => {
          iohandler.stderr('Access denied');
          this.setExitCode(255);
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

          this.websocket.ms('network', ['create'], data).subscribe(createData => {
            iohandler.stdout(Stdout.text('Name: ' + createData['name']));
            iohandler.stdout(Stdout.text('Visibility: ' + (createData['hidden'] ? 'private' : 'public')));
            this.setExitCode(0);
          }, error => {
            if (error.message === 'invalid_name') {
              iohandler.stderr('Name is invalid: Use 5 - 20 characters');
              this.setExitCode(1);
            } else if (error.message === 'name_already_in_use') {
              iohandler.stderr('Name already in use');
              this.setExitCode(1);
            } else {
              iohandler.stderr('Access denied');
              this.setExitCode(255);
            }
          });
        } else {
          iohandler.stderr('Please use public or private as mode');
          this.setExitCode(1);
        }

        return;
      } else if (args[0] === 'invite') {
        const data = {
          'uuid': args[1],
          'device': args[2]
        };

        this.websocket.ms('network', ['invite'], data).subscribe(() => {
          iohandler.stdout(Stdout.text(args[2] + ' invited to ' + args[1]));
          this.setExitCode(0);
        }, error => {
          if (error.message === 'network_not_found') {
            iohandler.stderr('Network not found: ' + args[1]);
            this.setExitCode(1);
          } else if (error.message === 'already_member_of_network') {
            iohandler.stderr('This device is already a member of this network');
            this.setExitCode(1);
          } else if (error.message === 'invitation_already_exists') {
            iohandler.stderr('You already invited this device');
            this.setExitCode(1);
          } else {
            iohandler.stderr('Access denied');
            this.setExitCode(255);
          }
        });

        return;
      } else if (args[0] === 'kick') {
        const data = {
          'uuid': args[1],
          'device': args[2]
        };

        if (data['device'] === this.activeDevice['uuid']) {
          iohandler.stderr('You cannot kick yourself');
          this.setExitCode(1);
          return;
        }

        this.websocket.ms('network', ['kick'], data).subscribe(kickData => {
          if (kickData['result']) {
            iohandler.stdout(Stdout.text('Kicked successfully'));
            this.setExitCode(0);
          } else {
            iohandler.stderr('The device is not a member of the network');
            this.setExitCode(1);
          }
        }, error => {
          if (error.message === 'cannot_kick_owner') {
            iohandler.stderr('You cannot kick the owner of the network');
            this.setExitCode(1);
          } else {
            iohandler.stderr('Access denied');
            this.setExitCode(255);
          }
        });

        return;
      }
    }
    iohandler.stderr('usage: ');
    iohandler.stderr('network list  # show all networks of this device');
    iohandler.stderr('network public   # show all public networks');
    iohandler.stderr('network invitations  # show invitations of a this device');
    iohandler.stderr('network info <uuid> # show info of network');
    iohandler.stderr('network get <name> # show info of network');
    iohandler.stderr('network members <uuid> # show members of network');
    iohandler.stderr('network leave <uuid> # leave a network');
    iohandler.stderr('network delete <uuid> # delete a network');
    iohandler.stderr('network request <uuid> # create a join request to a network');
    iohandler.stderr('network requests <uuid> # show requests of a network');
    iohandler.stderr('network accept <uuid> # accept an invitation or request');
    iohandler.stderr('network deny <uuid> # accept an invitation or request');
    iohandler.stderr('network invite <uuid> <device> # invite to network');
    iohandler.stderr('network revoke <uuid> # revoke an invitation');
    iohandler.stderr('network kick <uuid> <device> # kick device out of network');
    iohandler.stderr('network create <name> <private|public>   # create a network');
    this.setExitCode(1);
  }

  info(iohandler: IOHandler) {
    iohandler.stdout(Stdout.text('Username: ' + this.websocket.account.name));
    iohandler.stdout(Stdout.text('Host: ' + this.activeDevice['name']));

    const element = document.createElement('div');
    element.innerHTML = 'Address: <span style="color: silver;">'
      + DefaultTerminalState.promptAppender(this.activeDevice['uuid']) + '</span>';
    iohandler.stdout(Stdout.node(element));
    this.setExitCode(0);

    DefaultTerminalState.registerPromptAppenders(element);
  }

  run(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length === 0) {
      iohandler.stderr('usage: run <filename>');
      this.setExitCode(1);
      return;
    }
    let path: Path;
    try {
      path = Path.fromString(args[0], this.working_dir);
    } catch {
      iohandler.stderr('The specified path is not valid');
      this.setExitCode(1);
      return;
    }
    this.fileService.getFromPath(this.activeDevice['uuid'], path).subscribe(file => {
      if (file.is_directory) {
        iohandler.stderr('That is not a file');
        this.setExitCode(1);
      } else {
        // set special variables
        this.variables.set('#', String(args.length - 1));
        this.variables.set('0', args[0]);
        let numberOfArgs: number;
        for (numberOfArgs = 1; numberOfArgs < Math.min(args.length, 10); numberOfArgs++) {
          this.variables.set(String(numberOfArgs), args[numberOfArgs]);
        }
        const allArgs = args.slice(1).join(' ');
        this.variables.set('*', allArgs);
        this.variables.set('@', allArgs);
        this.execute(file.content);
        // reset special variables
        '#0*@'.split('').forEach((variable: string) => {
          this.variables.delete(variable);
        });
        for (let i = 0; i <= numberOfArgs; i++) {
          this.variables.delete(String(i));
        }
        this.setExitCode(0);
      }
    }, error => {
      if (error.message === 'file_not_found') {
        iohandler.stderr('That file does not exist');
        this.setExitCode(1);
      } else {
        this.reportError(error);
      }
    });
  }

  setVariable(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length !== 2) {
      iohandler.stderr('usage: set <name of variable> <value>');
      this.setExitCode(1);
      return;
    }
    this.variables.set(args[0], args[1]);
    this.setExitCode(0);
  }

  echo(iohandler: IOHandler) {
    iohandler.stdout(Stdout.text(iohandler.args.join(' ')));
    this.setExitCode(0);
  }

  read(iohandler: IOHandler) {
    const args = iohandler.args;
    if (args.length !== 1) {
      iohandler.stderr('usage: read <name of variable>');
      this.setExitCode(1);
      return;
    }
    iohandler.stdin((input) => {
      this.variables.set(args[0], input);
      this.setExitCode(0);
    });
  }

  msh(_: IOHandler) {
    this.terminal.pushState(
      new ShellTerminal(
        this.websocket, this.settings, this.fileService,
        this.domSanitizer, this.windowDelegate, this.activeDevice,
        this.terminal, this.promptColor
      )
    );
  }
}


export abstract class ChoiceTerminalState implements TerminalState {
  choices: {[choice: string]: () => void};

  protected constructor(protected terminal: TerminalAPI) {
  }

  execute(command: string) {
    if (!command) {
      return;
    }

    if (this.choices[command]) {
      this.choices[command]();
    } else {
      this.invalidChoice(command);
    }
  }

  invalidChoice(choice: string) {
    this.terminal.outputText('\'' + choice + '\' is not one of the following: ' + Object.keys(this.choices).join(', '));
  }

  async autocomplete(content: string): Promise<string> {
    return content ? Object.keys(this.choices).sort().find(choice => choice.startsWith(content)) : '';
  }

  getHistory(): string[] {
    return [];
  }

  abstract refreshPrompt();

}


export class YesNoTerminalState extends ChoiceTerminalState {
  choices = {
    'yes': () => {
      this.terminal.popState();
      this.callback(true);
    },
    'no': () => {
      this.terminal.popState();
      this.callback(false);
    }
  };

  constructor(terminal: TerminalAPI, private prompt: string, private callback: (response: boolean) => void) {
    super(terminal);
  }

  refreshPrompt() {
    this.terminal.changePrompt(this.prompt);
  }

}


export class BruteforceTerminalState extends ChoiceTerminalState {
  time = this.startSeconds;
  intervalHandle;
  choices = {
    'stop': () => {
      clearInterval(this.intervalHandle);
      this.terminal.popState();
      this.callback(true);
    },
    'exit': () => {
      clearInterval(this.intervalHandle);
      this.terminal.popState();
      this.callback(false);
    }
  };

  constructor(terminal: TerminalAPI,
              private domSanitizer: DomSanitizer,
              private callback: (response: boolean) => void,
              private startSeconds: number = 0) {
    super(terminal);

    this.intervalHandle = setInterval(() => {
      this.time += 1;
      this.refreshPrompt();
    }, 1000);
  }

  refreshPrompt() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    const prompt = `Bruteforcing ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} [stop/exit] `;
    this.terminal.changePrompt(`<span style="color: gold">${prompt}</span>`, true);
  }
}

class DefaultStdin implements TerminalState {
  private callback: (stdin: string) => void;

  constructor(private terminal: TerminalAPI) {}

  read(callback: (stdin: string) => void) {
    this.callback = callback;
    this.terminal.pushState(this);
  }

  execute(command: string) {
    const input = command ? command : '';
    this.terminal.popState();
    this.callback(input);
  }

  async autocomplete(_: string): Promise<string> {
    return '';
  }

  getHistory(): string[] {
    return [];
  }

  refreshPrompt() {
    this.terminal.changePrompt('>');
  }
}


class IOHandler {
  stdout: (stdout: Stdout) => void;
  stdin: (callback: (stdin: string) => void) => void;
  stderr: (stderr: string) => void;
  args: string[];
}

class Stderr {
  outputType: OutputType;
  data: string;
  dataNode: Node;

  constructor(outputType: OutputType, data: string) {
    this.outputType = outputType;
    this.data = data;
    this.dataNode = null;
  }

  static html(data: string): Stdout {
    return {outputType: OutputType.HTML, data: data, dataNode: null};
  }

  static raw(data: string): Stdout {
    return {outputType: OutputType.RAW, data: data, dataNode: null};
  }

  static text(data: string): Stdout {
    return {outputType: OutputType.TEXT, data: data, dataNode: null};
  }

  static node(data: Node): Stdout {
    return {outputType: OutputType.NODE, data: null, dataNode: data};
  }
}


class Stdout {
  outputType: OutputType;
  data: string;
  dataNode: Node;

  constructor(outputType: OutputType, data: string) {
    this.outputType = outputType;
    this.data = data;
    this.dataNode = null;
  }

  static html(data: string): Stdout {
    return {outputType: OutputType.HTML, data: data, dataNode: null};
  }

  static raw(data: string): Stdout {
    return {outputType: OutputType.RAW, data: data, dataNode: null};
  }

  static text(data: string): Stdout {
    return {outputType: OutputType.TEXT, data: data, dataNode: null};
  }

  static node(data: Node): Stdout {
    return {outputType: OutputType.NODE, data: null, dataNode: data};
  }
}

enum OutputType {
  HTML,
  RAW,
  TEXT,
  NODE,
}

class ShellTerminal implements TerminalState {
  private shell: Shell;

  constructor(private websocket: WebsocketService, private settings: SettingsService, private fileService: FileService,
              private domSanitizer: DomSanitizer, windowDelegate: WindowDelegate, private activeDevice: Device,
              private terminal: TerminalAPI, private promptColor: string = null
  ) {
    const shellApi = new ShellApi(
      this.websocket, this.settings, this.fileService,
      this.domSanitizer, windowDelegate, this.activeDevice,
      terminal, this.promptColor, this.refreshPrompt.bind(this),
      Path.ROOT
    );
    this.shell = new Shell(
      this.terminal.output.bind(this.terminal),
      // TODO use this
      // this.terminal.outputText.bind(this.terminal),
      this.stdinHandler.bind(this),
      this.terminal.outputText.bind(this.terminal),
      shellApi,
    );
  }

  /** default implementaion for stdin: reading from console */
  stdinHandler(callback: (input: string) => void) {
    return new DefaultStdin(this.terminal).read(callback);
  }

  execute(command: string) {
    this.shell.execute(command);
  }

  async autocomplete(content: string): Promise<string> {
    return await this.shell.autocomplete(content);
  }

  getHistory(): string[] {
    return this.shell.getHistory();
  }

  refreshPrompt() {
    this.fileService.getAbsolutePath(this.activeDevice['uuid'], this.shell.api.working_dir).subscribe(path => {
      // const color = this.domSanitizer.sanitize(SecurityContext.STYLE, this.promptColor || this.settings.getTPC());
      // TODO undo this
      const color = 'yellow';
      const prompt = this.domSanitizer.bypassSecurityTrustHtml(
        `<span style="color: ${color}">` +
        `${escapeHtml(this.websocket.account.name)}@${escapeHtml(this.activeDevice['name'])}` +
        `<span style="color: white">:</span>` +
        `<span style="color: #0089ff;">/${path.join('/')}</span>$` +
        `</span>`
      );
      this.terminal.changePrompt(prompt);
    });

  }

}

