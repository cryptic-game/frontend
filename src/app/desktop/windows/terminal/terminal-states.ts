import { Settings } from './../../../../dataclasses/settings';
import { TerminalAPI, TerminalState } from './terminal-api';
import { WebsocketService } from '../../../websocket.service';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { SettingsService } from '../settings/settings.service';


function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


export abstract class CommandTerminalState implements TerminalState {
  abstract commands: { [name: string]: (args: string[]) => void };

  protocol: string[] = [];

  executeCommand(command: string, args: string[]) {
    command = command.toLowerCase();
    if (this.commands.hasOwnProperty(command)) {
      this.commands[command](args);
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
    if (command) {
      this.protocol.unshift(command);
    }
  }

  abstract commandNotFound(command: string);

  autocomplete(content: string): string {
    return content
      ? Object.keys(this.commands)
        .filter(n => !['chaozz'].includes(n))
        .sort()
        .find(n => n.startsWith(content))
      : '';
  }

  getHistory(): string[] {
    return this.protocol;
  }

  abstract refreshPrompt();

}


export class DefaultTerminalState extends CommandTerminalState {

  commands = {
    'help': this.help.bind(this),
    'status': this.status.bind(this),
    'hostname': this.hostname.bind(this),
    'ls': this.ls.bind(this),
    'l': this.ls.bind(this),
    'dir': this.ls.bind(this),
    'touch': this.touch.bind(this),
    'cat': this.cat.bind(this),
    'rm': this.rm.bind(this),
    'cp': this.cp.bind(this),
    'mv': this.mv.bind(this),
    'exit': this.exit.bind(this),
    'quit': this.exit.bind(this),
    'clear': this.clear.bind(this),
    'history': this.history.bind(this),
    'morphcoin': this.morphcoin.bind(this),
    'pay': this.pay.bind(this),
    'service': this.service.bind(this),
    'spot': this.spot.bind(this),
    'connect': this.connect.bind(this),
    'network': this.network.bind(this),
    'info': this.info.bind(this),

    // easter egg
    'chaozz': () => {
      this.terminal.outputText('"mess with the best, die like the rest :D`" - chaozz');
    }
  };

  private static promptAppenderListener(evt: MouseEvent) {
    evt.stopPropagation();
    const this_ = <HTMLElement>evt.target;
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

  static registerPromptAppenders(element: HTMLElement) {
    element
      .querySelectorAll('.promptAppender')
      .forEach(el => el.addEventListener('click', DefaultTerminalState.promptAppenderListener));
  }

  static promptAppender(value: string): string {
    return `<span class="promptAppender" style="text-decoration: underline; cursor: pointer;">${escapeHtml(value)}</span>`;
  }

  constructor(protected websocket: WebsocketService, private settings: SettingsService, private domSanitizer: DomSanitizer,
    protected terminal: TerminalAPI, protected activeDevice: object, protected username: string,
    public promptColor: string = settings.getTPC()) {
    super();
  }

  commandNotFound(command: string) {
    this.terminal.output('Command could not be found.<br/>Type `help` for a list of commands.');
  }

  refreshPrompt() {
    const color = this.domSanitizer.sanitize(SecurityContext.STYLE, this.promptColor);
    const prompt = this.domSanitizer.bypassSecurityTrustHtml(
      `<span style="color: ${color}">${escapeHtml(this.username)}@${escapeHtml(this.activeDevice['name'])} $</span>`);
    this.terminal.changePrompt(prompt);
  }


  help(args: string[]) {
    const commands: string = Object.keys(this.commands)
      .filter(n => !['chaozz', 'help'].includes(n))
      .join('<br />');
    this.terminal.output(commands);
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
      }).subscribe(newDevice => {
        if (newDevice['uuid'] != null && newDevice['name'] != null) {
          this.activeDevice = newDevice;
          this.refreshPrompt();

          if (this.activeDevice['uuid'] === JSON.parse(sessionStorage.getItem('activeDevice'))['uuid']) {
            sessionStorage.setItem('activeDevice', JSON.stringify(newDevice));
          }
        } else {
          this.terminal.outputText('The hostname couldn\'t be changed');
        }
      });
    } else {
      this.websocket.ms('device', ['device', 'info'], { device_uuid: this.activeDevice['uuid'] }).subscribe(device => {
        if (device['uuid'] == null || device['name'] == null) {
          this.terminal.outputText(this.activeDevice['name']);
        } else {
          if (device['name'] !== this.activeDevice['name']) {
            this.activeDevice = device;
            this.refreshPrompt();
          }
          this.terminal.outputText(device['name']);
        }
      });
    }
  }

  ls(args: string[]) {
    this.websocket.ms('device', ['file', 'all'], {
      device_uuid: this.activeDevice['uuid']
    }).subscribe(r => {
      if (r.files != null) {
        r.files.forEach(e => {
          this.terminal.outputText(e.filename);
        });
      }
    });
  }

  touch(args: string[]) {
    if (args.length >= 1) {
      const filename = args[0];
      let content = '';

      if (args.length > 1) {
        content = args.slice(1).join(' ');
      }

      if(filename.length > 64) {
        this.terminal.outputText('That filename is too long');
        return;
      }

      this.websocket.ms('device', ['file', 'create'], {
        device_uuid: this.activeDevice['uuid'],
        filename: filename,
        content: content
      }).subscribe(r => {
        if (r.error != null) {
          this.terminal.outputText('That file already exists');
        }
      });
    } else {
      this.terminal.outputText('usage: touch <filename> [content]');
    }
  }

  cat(args: string[]) {
    if (args.length === 1) {
      const name = args[0];

      this.websocket.ms('device', ['file', 'all'], { device_uuid: this.activeDevice['uuid'] }).subscribe(r => {
        if (r.error != null) {
          this.terminal.outputText('That file does not exist');
        }

        let fileFound: Boolean = false;

        r.files.forEach(e => {
          if (e != null && e.filename === name) {
            this.terminal.outputText(e.content);
            fileFound = true;
          }
        });
        if (!fileFound) {
          this.terminal.outputText('That file does not exist');
        }
      });
    } else {
      this.terminal.outputText('usage: cat <filename>');
    }
  }

  rm(args: string[]) {
    if (args.length === 1) {
      const name = args[0];

      this.websocket.ms('device', ['file', 'all'], {
        device_uuid: this.activeDevice['uuid']
      }).subscribe(r => {
        if (r.files == null) {
          console.error('Unexpected error');
          return;
        }

        for (const file of r.files) {
          if (file != null && file.filename === name) {
            if (file.content !== '') {
              const uuid = file.content.split(' ')[0];
              const key = file.content.split(' ').splice(1).join(' ');
              this.websocket.ms('currency', ['get'], { source_uuid: uuid, key: key }).subscribe(r2 => {
                if (r2.error == null) {
                  this.terminal.pushState(new YesNoTerminalState(this.terminal,
                    '<span class="errorText">Are you sure you want to delete your wallet? [yes|no]</span>', answer => {
                      if (answer) {
                        this.websocket.ms('currency', ['delete'], { source_uuid: uuid, key: key }).subscribe(r3 => {
                          if (r3.error == null) {
                            this.websocket.ms('device', ['file', 'delete'], {
                              device_uuid: this.activeDevice['uuid'],
                              file_uuid: file.uuid
                            });
                          } else {
                            this.terminal.output('<span class="errorText"">The wallet couldn\'t be deleted successfully. ' +
                              'Please report this bug.</span>');
                          }
                        });
                      }
                    }));
                } else {
                  this.websocket.ms('device', ['file', 'delete'], {
                    device_uuid: this.activeDevice['uuid'],
                    file_uuid: file.uuid
                  });
                }
              });
            } else {
              this.websocket.ms('device', ['file', 'delete'], {
                device_uuid: this.activeDevice['uuid'],
                file_uuid: file.uuid
              });
            }

            return;
          }
        }

        this.terminal.outputText('That file does not exist');
      });
    } else {
      this.terminal.outputText('usage: rm <filename>');
    }
  }

  cp(args: string[]) {
    if (args.length === 2) {
      const src = args[0];
      const dest = args[1];

      this.websocket.ms('device', ['file', 'all'], { device_uuid: this.activeDevice['uuid'] }).subscribe(r => {
        if (r.files != null) {
          for (const file of r.files) {
            if (file != null && file.filename === src) {
              this.websocket.ms('device', ['file', 'create'], {
                device_uuid: this.activeDevice['uuid'],
                filename: dest,
                content: file.content
              }).subscribe(r2 => {
                if (r2['error'] != null) {
                  this.terminal.outputText('The file \'' + dest + '\' already exists');
                }
              });
              return;
            }
          }
          this.terminal.outputText('The file \'' + src + '\' does not exist');
        } else {
          console.error('Unexpected error');
        }
      });
    } else {
      this.terminal.outputText('usage: cp <source> <destination>');
    }
  }

  mv(args: string[]) {
    if (args.length === 2) {
      const src = args[0];
      const dest = args[1];

      this.websocket.ms('device', ['file', 'all'], { device_uuid: this.activeDevice['uuid'] }).subscribe(r => {
        if (r.files != null) {
          for (const file of r.files) {
            if (file != null && file.filename === src) {
              this.websocket.ms('device', ['file', 'create'], {
                device_uuid: this.activeDevice['uuid'],
                filename: dest,
                content: file.content
              }).subscribe(r2 => {
                if (r2['error'] == null) {
                  this.websocket.ms('device', ['file', 'delete'], {
                    device_uuid: this.activeDevice['uuid'],
                    file_uuid: file.uuid
                  });
                } else {
                  this.terminal.outputText('The file \'' + dest + '\' already exists');
                }
              });
              return;
            }
          }
          this.terminal.outputText('The file \'' + src + '\' does not exist');
        } else {
          console.error('Unexpected error');
        }
      });
    } else {
      this.terminal.outputText('usage: mv <source> <destination>');
    }
  }

  exit() {
    this.terminal.popState();
  }

  clear() {
    this.terminal.clear();
  }

  history() {
    const l = this.getHistory();

    l.reverse();

    l.forEach(e => {
      this.terminal.outputText(e);
    });
  }

  morphcoin(args: string[]) {
    if (args.length === 2) {
      const filename = args[1];
      if (args[0] === 'look') {
        this.websocket.ms('device', ['file', 'all'], {
          device_uuid: this.activeDevice['uuid']
        }).subscribe(r => {
          for (const e of r.files) {
            if (e != null && e.filename === filename) {
              if (e.content !== '') {
                const uuid = e.content.split(' ')[0];
                const key = e.content.split(' ').splice(1).join(' ');
                this.websocket.ms('currency', ['get'], {
                  source_uuid: uuid,
                  key: key
                }).subscribe(r2 => {
                  if (r2.error == null) {
                    this.terminal.outputText(r2.amount + ' morphcoin');
                  } else {
                    this.terminal.outputText('File is no walletfile');
                  }
                });
                return;
              } else {
                this.terminal.outputText('File is no valid walletfile');
                return;
              }
            }
          }
          this.terminal.outputText('That file does not exist');
        });
      } else if (args[0] === 'create') {
        this.websocket.ms('device', ['file', 'all'], { device_uuid: this.activeDevice['uuid'] }).subscribe(r => {
          if (r.files == null) {
            console.error('Unexpected error');
            return;
          }
          if (r.files.some(file => file != null && file.filename === filename)) {
            this.terminal.outputText('That file already exists');
            return;
          }

          this.websocket.ms('currency', ['create'], {}).subscribe(r2 => {
            if (r2['error'] != null) {
              this.terminal.outputText('You already own a wallet');
              return;
            }

            this.websocket.ms('device', ['file', 'create'], {
              device_uuid: this.activeDevice['uuid'],
              filename: filename,
              content: r2.source_uuid + ' ' + r2.key
            }).subscribe(r3 => {
              if (r3['error'] != null) {
                this.terminal.outputText('That file couldn\'t be created. Please note your wallet credentials ' +
                  'and put them in a new file with \'touch\' or contact the support: \'' + r2.source_uuid + ' ' + r2.key + '\'');
              }
            });
          });
        });
      }
    } else {
      this.terminal.outputText('usage: morphcoin look|create <filename>');
    }
  }

  pay(args: string[]) {
    if (args.length === 3 || args.length === 4) {
      const filename = args[0];
      const receiver = args[1];
      const amount = args[2];
      let usage = '';

      if (args.length === 4) {
        usage = args[3];
      }

      if (isNaN(parseInt(amount, 10))) {
        this.terminal.output('<em>amount</em> is not a number');
      } else {
        this.websocket
          .ms('device', ['file', 'all'], {
            device_uuid: this.activeDevice['uuid']
          })
          .subscribe(r => {
            r.files.forEach(e => {
              if (e != null && e.filename === filename) {
                if (e.content !== '') {
                  const uuid = e.content.split(' ')[0];
                  const key = e.content
                    .split(' ')
                    .splice(1)
                    .join(' ');
                  this.websocket
                    .ms('currency', ['get'], {
                      source_uuid: uuid,
                      key: key
                    })
                    .subscribe(r2 => {
                      if (r2.error == null) {
                        this.websocket
                          .ms('currency', ['send'], {
                            source_uuid: uuid,
                            key: key,
                            send_amount: parseInt(amount, 10),
                            destination_uuid: receiver,
                            usage: usage
                          })
                          .subscribe(r3 => {
                              if (r3.error == null) {
                                this.terminal.outputText('send ' + amount + ' to ' + receiver);
                              } else {
                                this.terminal.outputText(r3.error);
                              }
                            }
                          );
                      } else {
                        this.terminal.output('No valid walletfile');
                      }
                    });
                }
              }
            });
          });
      }
    } else {
      this.terminal.outputText('usage: pay <filename> <receiver> <amount> [usage]');
    }
  }

  service(args: string[]) {
    const activeDevice = this.activeDevice['uuid'];

    const getServices = () =>
      this.websocket.ms('service', ['list'], { device_uuid: activeDevice }).pipe(map(data => {
        if (data['error'] != null) {
          console.warn(data['error']);
          return [];
        } else if (!Array.isArray(data['services'])) {
          console.warn(data);
          return [];
        } else {
          return data['services'];
        }
      }));

    const getService = name => getServices().pipe(map(services => {
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
      this.websocket.ms('service', ['create'], { name: service, device_uuid: activeDevice }).subscribe(data => {
        if (data['error'] == null) {
          this.terminal.outputText('Service was created');
        } else {
          this.terminal.outputText('You already created this service');  // TODO: more detailed errors
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
            .map(service => '<li>' + escapeHtml(service.name) + ' (<em>' +
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

        this.websocket.ms('service', ['bruteforce', 'status'], {
          service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
        }).subscribe(statusData => {
          if ('error' in statusData) {
            if (statusData['error'] === 'attack_not_running') {
              this.websocket.ms('service', ['bruteforce', 'attack'], {
                service_uuid: bruteforceService['uuid'], device_uuid: activeDevice,
                target_device: targetDevice, target_service: targetService
              }).subscribe(attackData => {
                if (attackData['ok'] === true) {
                  this.terminal.outputText('You started a bruteforce attack');
                  this.terminal.pushState(new BruteforceTerminalState(this.terminal, this.domSanitizer, stop => {
                    if (stop) {
                      this.executeCommand('service', ['bruteforce', targetDevice, targetService]);
                    }
                  }));
                } else if (attackData['error'] === 'could_not_start_service') {
                  this.terminal.outputText('There was an error while starting the bruteforce attack');
                } else {
                  console.warn(attackData);
                }
              });
            } else {
              this.terminal.outputText('Error: ' + statusData['error']);
            }
          } else if ('uuid' in statusData) {
            this.websocket.ms('service', ['bruteforce', 'stop'], {
              service_uuid: bruteforceService['uuid'], device_uuid: activeDevice
            }).subscribe(stopData => {
              if (stopData['access'] === true) {
                this.terminal.outputText('Access granted - use `connect <device>`');
              } else {
                this.terminal.outputText('Access denied. The bruteforce attack was not successful');
              }
            });
          } else {
            this.terminal.outputText('Your attack couldn\'t be started');
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
          if (runningServices == null || !(runningServices instanceof Array) || (runningServices as any[]).length === 0) {
            this.terminal.outputText('That device doesn\'t have any running services');
            return;
          }

          this.terminal.outputText('Open ports on that device:');

          const list = document.createElement('ul');
          list.innerHTML = '<ul>' +
            (runningServices as any[])
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
      if (random_device['uuid'] == null) {
        this.terminal.output('<span class="errorText">An error occurred</span>');
        return;
      }

      this.websocket.ms('service', ['list'], { 'device_uuid': this.activeDevice['uuid'] }).subscribe(localServices => {
        const portScanner = (localServices['services'] || []).filter(service => service.name === 'portscan')[0];
        if (portScanner == null || portScanner['uuid'] == null) {
          this.terminal.outputText('\'' + random_device['name'] + '\':');
          this.terminal.outputRaw('<ul>' +
            '<li>UUID: ' + random_device['uuid'] + '</li>' +
            '<li>Services: <em class="errorText"">portscan failed</em></li>' +
            '</ul>');
          return;
        }

        this.websocket.ms('service', ['use'], {
          'device_uuid': this.activeDevice['uuid'],
          'service_uuid': portScanner['uuid'], 'target_device': random_device['uuid']
        }).subscribe(remoteServices => {
          if (remoteServices == null || remoteServices['services'] == null) {
            this.terminal.output('<span class="errorText">An error occurred</span>');
            return;
          }

          this.terminal.outputText('\'' + escapeHtml(random_device['name']) + '\':');
          const list = document.createElement('ul');
          list.innerHTML = '<li>UUID: ' + DefaultTerminalState.promptAppender(random_device['uuid']) + '</li>' +
            '<li>Services:</li>' +
            '<ul>' +
            remoteServices['services']
              .map(service => '<li>' + escapeHtml(service['name']) + ' (' + DefaultTerminalState.promptAppender(service['uuid']) + ')</li>')
              .join('\n') +
            '</ul>';
          this.terminal.outputNode(list);
          DefaultTerminalState.registerPromptAppenders(list);
        });
      });
    });
  }

  connect(args: string[]) {
    if (args.length !== 1) {
      this.terminal.outputText('usage: connect <device>');
      return;
    }

    this.websocket.ms('device', ['device', 'info'], { device_uuid: args[0] }).subscribe(infoData => {
      if (infoData.error != null) {
        this.terminal.outputText(infoData.error);
        return;
      }

      this.websocket.ms('service', ['part_owner'], { device_uuid: args[0] }).subscribe(partOwnerData => {
        if (partOwnerData.error != null) {
          this.terminal.outputText(partOwnerData.error);
          return;
        }

        const user_uuid = JSON.parse(sessionStorage.getItem('activeDevice'))['owner'];
        if (infoData['owner'] === user_uuid || partOwnerData['ok'] === true) {
          this.terminal.pushState(new DefaultTerminalState(this.websocket, this.settings, this.domSanitizer, this.terminal,
            infoData, this.username, '#DD2C00'));
        } else {
          this.terminal.outputText('Access denied');
        }
      });
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

            networks.forEach(network => {
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

            memberNetworks.forEach(network => {
              if(network['owner'] == this.activeDevice['uuid']) {
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

        this.websocket.ms('network', ['invitations'], data).subscribe(invitationsData => {
          if (!('error' in invitationsData) && invitationsData['invitations']) {
            const invitations = invitationsData['invitations'];

            if (invitations.length === 0) {
              this.terminal.outputText('No invitations found');
            } else {
              this.terminal.outputText('Found ' + invitations.length + ' invitations: ');

              const element = document.createElement('div');
              element.innerHTML = '';

              invitations.forEach(invitation => {
                this.websocket.ms('network', ['get'], { 'uuid': invitation['network'] }).subscribe(network => {
                  element.innerHTML += '<br>Invitation: ' + '<span style="color: grey">' +
                    DefaultTerminalState.promptAppender(invitation['uuid']) + '</span><br>' +
                    'Network: ' + escapeHtml(network['name']) + '<br>' +
                    'Owner: ' + '<span style="color: grey">' + DefaultTerminalState.promptAppender(network['owner']) + '</span><br>';
                  DefaultTerminalState.registerPromptAppenders(element);
                });
              });

              this.terminal.outputNode(element);
            }
          } else {
            this.terminal.outputText('Access denied');
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

        this.websocket.ms('network', ['delete'], data).subscribe(deleteData => {
          if (!('error' in deleteData) && deleteData['result']) {
            this.terminal.outputText('Network deleted');
          } else {
            this.terminal.outputText('Access denied');
          }
        });

        return;
      } else if (args[0] === 'request') {
        const data = {
          'uuid': args[1],
          'device': this.activeDevice['uuid']
        };

        this.websocket.ms('network', ['request'], data).subscribe(requestData => {
          if (!('error' in requestData)) {
            this.terminal.outputText('Request send:');
            this.terminal.outputText(this.activeDevice['name'] + ' -> ' + requestData['network']);
          } else {
            if (requestData['error'] === 'network_not_found') {
              this.terminal.outputText('Network not found: ' + args[1]);
            } else if (requestData['error'] === 'already_member_of_network') {
              this.terminal.outputText('You are already a member of this network');
            } else if (requestData['error'] === 'invitation_already_exists') {
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

        this.websocket.ms('network', ['requests'], data).subscribe(requestsData => {
          if (!('error' in requestsData) && requestsData['requests']) {
            const requests = requestsData['requests'];

            if (requests.length === 0) {
              this.terminal.outputText('No requests found');
            } else {
              this.terminal.outputText('Found ' + requests.length + ' requests: ');

              const element = document.createElement('div');
              element.innerHTML = '';

              requests.forEach(request => {
                element.innerHTML += '<br>Request: <span style="color: grey;">' +
                  DefaultTerminalState.promptAppender(request['uuid']) + '</span><br>' +
                  'Device: <span style="color: grey;">' +
                  DefaultTerminalState.promptAppender(request['device']) + '</span><br>';
              });

              this.terminal.outputNode(element);

              DefaultTerminalState.registerPromptAppenders(element);
            }
          } else {
            this.terminal.outputText('Access denied');
          }
        });

        return;
      } else if (args[0] === 'accept' || args[0] === 'deny' || args[0] === 'revoke') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', [args[0]], data).subscribe(updateData => {
          if (!('error' in updateData) && updateData['result']) {
            this.terminal.outputText(args[1] + ' -> ' + args[0]);
          } else {
            if (updateData['error'] === 'invitation_not_found') {
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

        this.websocket.ms('network', ['leave'], data).subscribe(leaveData => {
          if (!('error' in leaveData) && leaveData['result']) {
            this.terminal.outputText('You left the network: ' + args[1]);
          } else {
            if(leaveData['error'] === 'cannot_leave_own_network') {
              this.terminal.outputText('You can not leave your own network');
            } else {
              this.terminal.outputText('Access denied');
            }
          }
        });

        return;
      } else if (args[0] === 'info' || args[0] === 'get') {
        const data = {};
        data[args[0] === 'info' ? 'uuid' : 'name'] = args[1];

        this.websocket.ms('network', [args[0] === 'info' ? 'get' : 'name'], data).subscribe(getData => {
          if (!('error' in getData)) {
            const element = document.createElement('div');
            element.innerHTML = 'UUID: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['uuid']) + '</span><br>';
            element.innerHTML += 'Name: ' + escapeHtml(getData['name']) + '<br>';
            element.innerHTML += 'Hidden: ' + (getData['hidden'] ? 'private' : 'public') + '<br>';
            element.innerHTML += 'Owner: <span style="color: grey;">' + DefaultTerminalState.promptAppender(getData['owner']) + '</span>';

            this.terminal.outputNode(element);

            DefaultTerminalState.registerPromptAppenders(element);
          } else {
            this.terminal.outputText('Network not found: ' + args[1]);
          }
        });

        return;
      } else if (args[0] === 'members') {
        const data = {
          'uuid': args[1]
        };

        this.websocket.ms('network', ['members'], data).subscribe(membersData => {
          if (!('error' in membersData)) {
            const members = membersData['members'];

            if (members != null && members.length > 0) {
              this.terminal.outputText('Found ' + members.length + ' members: ');
              this.terminal.outputText('');

              const element = document.createElement('div');
              element.innerHTML = '';

              members.forEach(member => {
                element.innerHTML += ' <span style="color: grey">' + DefaultTerminalState.promptAppender(member['device']) + '</span><br>';
              });

              this.terminal.outputNode(element);

              DefaultTerminalState.registerPromptAppenders(element);
            } else {
              this.terminal.outputText('This network has no members');
            }
          } else {
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

          this.websocket.ms('network', ['create'], data).subscribe(createData => {
            if (!('error' in createData)) {
              this.terminal.outputText('Name: ' + createData['name']);
              this.terminal.outputText('Visibility: ' + (createData['hidden'] ? 'private' : 'public'));
            } else {
              if (createData['error'] === 'invalid_name') {
                this.terminal.outputText('Name is invalid: Use 5 - 20 characters');
              } else if (createData['error'] === 'name_already_in_use') {
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

        this.websocket.ms('network', ['invite'], data).subscribe(inviteData => {
          if (!('error' in inviteData)) {
            this.terminal.outputText(args[2] + ' invited to ' + args[1]);
          } else {
            if (inviteData['error'] === 'network_not_found') {
              this.terminal.outputText('Network not found: ' + args[1]);
            } else if (inviteData['error'] === 'already_member_of_network') {
              this.terminal.outputText('This device is already a member of this network');
            } else if (inviteData['error'] === 'invitation_already_exists') {
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

        if(data['device'] === this.activeDevice['uuid']) {
          this.terminal.outputText("You cannot kick yourself");
          return;
        }

        this.websocket.ms('network', ['kick'], data).subscribe(kickData => {
          if (!('error' in kickData) && kickData['result']) {
            this.terminal.outputText('Kicked successfully');
          } else {
            if(kickData['error'] === 'cannot_kick_owner') {
              this.terminal.outputText('You can not kick the owner of the network');
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

  info(args: string[]) {
    this.terminal.outputText('Username: ' + this.username);
    this.terminal.outputText('Host: ' + this.activeDevice['name']);

    const element = document.createElement('div');
    element.innerHTML = `Address: <span style="color: silver;">${DefaultTerminalState.promptAppender(this.activeDevice['uuid'])}</span>`;
    this.terminal.outputNode(element);

    DefaultTerminalState.registerPromptAppenders(element);
  }
}


export abstract class ChoiceTerminalState implements TerminalState {
  choices: { [choice: string]: () => void };

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

  autocomplete(content: string): string {
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
  time = this.startSeconds;
  intervalHandle;

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
