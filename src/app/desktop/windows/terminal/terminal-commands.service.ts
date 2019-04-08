import { Injectable } from '@angular/core';
import { TerminalAPI } from './terminal-api';
import { WebsocketService } from '../../../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class TerminalCommandsService {
  programs = {
    status: this.status,
    hostname: this.hostname,
    ls: this.ls,
    l: this.ls,
    dir: this.ls,
    touch: this.touch,
    cat: this.cat,
    rm: this.rm,
    cp: this.cp,
    mv: this.mv,
    exit: this.exit,
    quit: this.exit,
    clear: this.clear,
    morphcoin: this.morphcoin,

    // easter egg
    chaozz: (args: string[], terminal: TerminalAPI) => {
      terminal.output('"mess with the best, die like the rest :D`" - chaozz');
    }
  };

  constructor(private websocket: WebsocketService) {
  }

  execute(command: string, args: string[], terminal: TerminalAPI) {
    command = command.toLowerCase();
    if (this.programs.hasOwnProperty(command)) {
      this.programs[command](args, terminal);
    } else if (command !== '') {
      terminal.output('Command could not be found.');
    }
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
      terminal.output(JSON.parse(sessionStorage.getItem('activeDevice')).name);
    }
  }

  status(args: string[], terminal: TerminalAPI) {
    this.websocket.request({
      action: 'info'
    }).subscribe(r => {
      terminal.output('online = ' + (r.online - 1));
    });
  }

  ls(args: string[], terminal: TerminalAPI) {
    this.websocket.ms('device', ['file', 'all'], {
      device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
    }).subscribe(r => {
      if (r.files != null) {
        r.files.forEach(e => {
          terminal.output(e.filename);
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
              terminal.output(e.content);
            }
          }
        });
      });
    } else {
      terminal.output(
        'usage: cat <filename>'
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      );
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
      terminal.output(
        'usage: cp <source> <destination>'
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      );
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
      terminal.output(
        'usage: mv <source> <destination>'
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      );
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
      terminal.output(
        'usage: touch <filename> [content]'
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      );
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
      terminal.output(
        'usage: rm <filename>'
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      );
    }
  }

  morphcoin(args: string[], terminal: TerminalAPI) {
    if (args.length === 2) {
      const filename = args[1];
      if (args[0] === 'look') {
        this.websocket.ms('device', ['file', 'all'], {
          device_uuid: JSON.parse(sessionStorage.getItem('activeDevice')).uuid
        }).subscribe(r => {
          r.files.forEach(e => {
            if (e != null && e.filename === name) {
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
                    terminal.output(r2.wallet_response.amount + ' morphcoin');
                  } else {
                    terminal.output('no valid walletfile');
                  }
                });
              }
            }
          });
        });
        return;
      } else if (args[0] === 'create') {
        this.websocket.ms('currency', ['create'], {}).subscribe(r => {
          this.websocket.ms('device', ['file', 'create'], {
            device_uuid: JSON.parse(sessionStorage.getItem('activeDevice'))
              .uuid,
            filename: filename,
            content: r.uuid + ' ' + r.key
          });
        });
        return;
      }
    }
    terminal.output(
      'usage: morphcoin <look|create> <filename>'
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    );
  }

  exit(args: string[], terminal: TerminalAPI) {
    terminal.closeTerminal();
  }

  clear(args: string[], terminal: TerminalAPI) {
    terminal.clear();
  }
}
