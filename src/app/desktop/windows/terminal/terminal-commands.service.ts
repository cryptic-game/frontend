import {Injectable} from '@angular/core';
import {TerminalAPI} from './terminal-api';
import {HttpClient} from '@angular/common/http';
import { CLIENT, WebsocketService } from "../../../websocket.service";

@Injectable({
  providedIn: 'root'
})
export class TerminalCommandsService {

  programs = {
    'ping': (args: string[], terminal: TerminalAPI) => {
    },
    'status': (args: string[], terminal: TerminalAPI) => {
      let ws = new WebsocketService();
      ws.request({
        "action": "status"
      }).subscribe(r => {
        terminal.output("online = " + (r.online - 1));
        ws.close();
      });
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
