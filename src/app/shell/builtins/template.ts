import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Template extends Command {
  constructor(shellApi: ShellApi) {
    super('COMMANDNAME', shellApi);
    this.addDescription('');
  }

  async run(iohandler: IOHandler): Promise<number> {
    return -1;
  }
}
