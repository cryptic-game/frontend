import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Shutdown extends Command {
  constructor(shellApi: ShellApi) {
    super('shutdown', shellApi);
    this.addDescription('shutdown your own device');
  }

  async run(_: IOHandler): Promise<number> {
    return await this.shellApi.terminal.shutdown() ? 0 : 1;
  }
}
