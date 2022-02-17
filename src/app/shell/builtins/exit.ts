import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Exit extends Command {
  constructor(shellApi: ShellApi) {
    super('exit', shellApi);
    this.addDescription('closes the terminal or leaves another device');
  }

  async run(_: IOHandler): Promise<number> {
    this.shellApi.terminal.popState();
    return 0;
  }
}
