import { Injectable } from '@angular/core';
import { TerminalAPI } from './terminal-api';
import { WebsocketService } from '../../../websocket.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TerminalCommandsService {

  programs = {
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
    'history': this.history,
    'pay': this.pay.bind(this),
    'help': this.help.bind(this),
    'morphcoin': this.morphcoin.bind(this),
    'service': this.service.bind(this),

    // easter egg
    'chaozz': (args: string[], terminal: TerminalAPI) => {
      terminal.outputText('"mess with the best, die like the rest :D`" - chaozz');
    }
  };

  constructor(private websocket: WebsocketService) {
  }

  execute(command: string, args: string[], terminal: TerminalAPI) {
    command = command.toLowerCase();
    if (this.programs.hasOwnProperty(command)) {
      this.programs[command](args, terminal);
    } else if (command !== '') {
      terminal.output(
        'Command could not be found.<br/>Type `help` for a list of commands.'
      );
    }
  }

  pay(args: string[], terminal: TerminalAPI) {
    if (args.length === 3 || args.length === 4) {
      const filename = args[0];
      const receiver = args[1];
      const amount = args[2];
      let usage = '';

      if (args.length === 4) {
        usage = args[3];
      }

      if (isNaN(parseInt(amount, 10))) {
        terminal.output('<em>amount</em> is not a number');
      } else {
        this.websocket
          .ms('device', ['file', 'all'], {
            device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
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
                                terminal.outputText('send ' + amount + ' to ' + receiver);
                              } else {
                                terminal.outputText(r3.error);
                              }
                            }
                          );
                      } else {
                        terminal.output('no valid walletfile');
                      }
                    });
                }
              }
            });
          });
      }
    } else {
      terminal.outputText('usage: pay <filename> <receiver> <amount> [usage]');
    }
  }

  history(args: string[], terminal: TerminalAPI) {
    const l = terminal.getHistory();

    l.reverse();

    l.forEach(e => {
      terminal.outputText(e);
    });
  }

  hostname(args: string[], terminal: TerminalAPI) {
    if (args.length === 1) {
      const hostname = args[0];
      this.websocket.ms('device', ['device', 'change_name'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid,
        name: hostname
      }).subscribe(r => {
        sessionStorage.setItem('activeDevice', JSON.stringify(r));
        terminal.refreshPrompt();
      });

      const active = JSON.parse(sessionStorage.getItem('activeDevice'));
      active['name'] = hostname;
      sessionStorage.setItem('activeDevice', JSON.stringify(active));
      terminal.refreshPrompt();
    } else {
      terminal.outputText(JSON.parse(sessionStorage.getItem('activeDevice')).name);
    }
  }

  status(args: string[], terminal: TerminalAPI) {
    this.websocket.request({
      action: 'info'
    }).subscribe(r => {
      terminal.outputText('online = ' + (r.online - 1));
    });
  }

  ls(args: string[], terminal: TerminalAPI) {
    this.websocket.ms('device', ['file', 'all'], {
      device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
    }).subscribe(r => {
      if (r.files != null) {
        r.files.forEach(e => {
          terminal.outputText(e.filename);
        });
      }
    });
  }

  cat(args: string[], terminal: TerminalAPI) {
    if (args.length === 1) {
      const name = args[0];

      this.websocket.ms('device', ['file', 'all'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
      }).subscribe(r => {
        r.files.forEach(e => {
          if (e != null && e.filename === name) {
            if (e.content !== '') {
              terminal.outputText(e.content);
            }
          }
        });
      });
    } else {
      terminal.outputText('usage: cat <filename>');
    }
  }

  cp(args: string[], terminal: TerminalAPI) {
    if (args.length === 2) {
      const src = args[0];
      const dest = args[1];

      this.websocket.ms('device', ['file', 'all'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
      }).subscribe(r => {
        r.files.forEach(e => {
          if (e != null && e.filename === src) {
            this.websocket.ms('device', ['file', 'create'], {
              device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
                .uuid,
              filename: dest,
              content: e.content
            });
          }
        });
      });
    } else {
      terminal.outputText('usage: cp <source> <destination>');
    }
  }

  mv(args: string[], terminal: TerminalAPI) {
    if (args.length === 2) {
      const src = args[0];
      const dest = args[1];

      this.websocket.ms('device', ['file', 'all'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
      }).subscribe(r => {
        r.files.forEach(e => {
          if (e != null && e.filename === src) {
            this.websocket.ms('device', ['file', 'create'], {
              device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
                .uuid,
              filename: dest,
              content: e.content
            }).subscribe(r2 => {
              this.websocket.ms('device', ['file', 'delete'], {
                device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
                  .uuid,
                file_uuid: e.uuid
              });
            });
          }
        });
      });
    } else {
      terminal.outputText('usage: mv <source> <destination>');
    }
  }

  touch(args: string[], terminal: TerminalAPI) {
    if (args.length >= 1) {
      const filename = args[0];
      let content = '';

      if (args.length > 1) {
        content = args.slice(1).join(' ');
      }

      this.websocket.ms('device', ['file', 'create'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid,
        filename: filename,
        content: content
      });
    } else {
      terminal.outputText('usage: touch <filename> [content]');
    }
  }

  rm(args: string[], terminal: TerminalAPI) {
    if (args.length === 1) {
      const name = args[0];

      this.websocket.ms('device', ['file', 'all'], {
        device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
      }).subscribe(r => {
        r.files.forEach(e => {
          if (e != null && e.filename === name) {
            this.websocket.ms('device', ['file', 'delete'], {
              device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
                .uuid,
              file_uuid: e.uuid
            });
          }
        });
      });
    } else {
      terminal.outputText('usage: rm <filename>');
    }
  }

  morphcoin(args: string[], terminal: TerminalAPI) {
    if (args.length === 2) {
      const filename = args[1];
      if (args[0] === 'look') {
        this.websocket.ms('device', ['file', 'all'], {
          device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
        }).subscribe(r => {
          for (const e of r.files) {
            if (e != null && e.filename === filename) {
              if (e.content !== '') {
                const uuid = e.content.split(' ')[0];
                const key = e.content
                  .split(' ')
                  .splice(1)
                  .join(' ');
                this.websocket.ms('currency', ['get'], {
                  source_uuid: uuid,
                  key: key
                }).subscribe(r2 => {
                  if (r2.error == null) {
                    terminal.outputText(r2.success.amount + ' morphcoin');
                  } else {
                    terminal.outputText('No valid walletfile');
                  }
                  return;
                });
              }
            }
          }
          terminal.outputText('That file doesn\'t exist');
        });
      } else if (args[0] === 'create') {
        this.websocket.ms('currency', ['create'], {}).subscribe(r => {
          this.websocket.ms('device', ['file', 'create'], {
            device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
              .uuid,
            filename: filename,
            content: r.uuid + ' ' + r.key
          });
        });
      }
    } else {
      terminal.outputText('usage: morphcoin look|create <filename>');
    }
  }

  service(args: string[], terminal: TerminalAPI) {
    const activeDevice = JSON.parse(sessionStorage.getItem('activeDevice')).uuid;

    const getService = name => {
      return this.websocket.ms('service', ['list'], { device_uuid: activeDevice }).pipe(map(data => {
        const deviceServices = data['services'];
        if (deviceServices == null || !(deviceServices instanceof Array)) {
          return null;
        }
        return (deviceServices as any[]).find(service => service['name'] === name);
      }));
    };

    if (args.length >= 1 && args[0].toLowerCase() === 'create') {
      if (args.length !== 2) {
        terminal.outputText('usage: service create <brute4ce|portscan|telnet|ssh>');
        return;
      }

      const service = args[1];
      const services = ['brute4ce', 'portscan', 'telnet', 'ssh'];
      if (!services.includes(service)) {
        terminal.outputText('Unknown service. Available services: ' + services.join(', '));
        return;
      }
      this.websocket.ms('service', ['create'], { name: service, device_uuid: activeDevice }).subscribe(data => {
        if (data['error'] == null) {
          terminal.outputText('Service was created');
        } else {
          terminal.outputText('You already created this service');  // TODO: more detailed errors
        }
      });
    } else if (args.length >= 1 && args[0] === 'bruteforce') {
      if (args.length !== 3) {
        terminal.outputText('usage: service bruteforce <target-device> <target-service>');
        return;
      }

      const [targetDevice, targetService] = args.slice(1);
      getService('bruteforce').subscribe(bruteforceService => {
        if (bruteforceService == null) {
          terminal.outputText('You have to create a bruteforce service before you use it');
          return;
        }

        this.websocket.ms('service', ['use'], {
          service_uuid: bruteforceService, device_uuid: activeDevice,
          target_device: targetDevice, target_service: targetService
        }).subscribe(useData => {
          if (useData['ok'] === true) {
            if (useData['access'] == null) {
              terminal.outputText('You started a bruteforce attack');
            } else if (useData['access'] === true) {
              terminal.outputText('Access granted');
            } else {
              terminal.outputText('Access denied. The bruteforce attack was not successful');
            }
          } else {
            terminal.outputText('Your attack couldn\'t be started');
          }
        });
      });
    } else if (args.length >= 1 && args[0] === 'portscan') {
      if (args.length !== 2) {
        terminal.outputText('usage: service portscan <device>');
      }

      const targetDevice = args[1];
      getService('portscan').subscribe(portscanService => {
        if (portscanService == null) {
          terminal.outputText('You have to create a portscan service before you use it');
          return;
        }

        this.websocket.ms('service', ['use'], {
          service_uuid: portscanService, device_uuid: activeDevice,
          target_device: targetDevice
        }).subscribe(data => {
          const runningServices = data['services'];
          if (runningServices == null || !(runningServices instanceof Array) || (runningServices as any[]).length === 0) {
            terminal.outputText('That device doesn\'t have any running services');
            return;
          }

          terminal.outputText('Running services on that device:')
          (runningServices as any[])
            .map(service => service['name'] + ' (UUID: ' + service['uuid'] + ' Port: ' + service['running_port'] + ')')
            .forEach(service => terminal.outputText(service));
        });
      });
    } else {
      terminal.outputText('usage: service create|bruteforce|portscan');
    }
  }

  exit(args: string[], terminal: TerminalAPI) {
    terminal.closeTerminal();
  }

  clear(args: string[], terminal: TerminalAPI) {
    terminal.clear();
  }

  help(args: string[], terminal: TerminalAPI) {
    const commands: string = Object.keys(this.programs)
      .filter(n => !['chaozz', 'help'].includes(n))
      .join('<br />');
    terminal.output(commands);
  }
}
