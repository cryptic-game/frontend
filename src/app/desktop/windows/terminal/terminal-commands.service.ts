import {Injectable} from '@angular/core';
import {TerminalAPI} from './terminal-api';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TerminalCommandsService {

  programs = {
    'ping': (args: string[], terminal: TerminalAPI) => {
      terminal.output('pong');
    },
    'echo': (args: string[], terminal: TerminalAPI) => {
      terminal.output(args.join(' '));
    },
    'exit': (args: string[], terminal: TerminalAPI) => {
      terminal.closeTerminal();
    }
  };

  constructor(private httpClient: HttpClient) {
  }

  execute(command: string, args: string[], terminal: TerminalAPI) {
    command = command.toLowerCase();
    if (this.programs.hasOwnProperty(command)) {
      this.programs[command](args, terminal);
    } else {
      terminal.output('Command could not be found.');
    }
  }

}
