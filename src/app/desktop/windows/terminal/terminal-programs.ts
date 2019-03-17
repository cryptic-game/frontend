import {TerminalAPI} from './terminal-api';

export class TerminalPrograms {
  static programs = {
    'ping': (args: string[], terminal: TerminalAPI) => {
      console.log('hi');
      terminal.output('pong');
    },
    'echo': (args: string[], terminal: TerminalAPI) => {
      terminal.output(args.join(' '));
    }
  };
}
