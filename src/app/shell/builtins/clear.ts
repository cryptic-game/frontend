import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Clear extends Command {
  constructor(shellApi: ShellApi) {
    super('clear', shellApi);
    this.addDescription('clears the terminal');
  }

  async run(_: IOHandler): Promise<number> {
    this.shellApi.terminal.clear();
    return 0;
  }
}
