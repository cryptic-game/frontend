import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Status extends Command {
  constructor(shellApi: ShellApi) {
    super('status', shellApi);
    this.addDescription('displays the number of online players');
  }

  async run(iohandler: IOHandler): Promise<number> {
    const r = await this.shellApi.websocket.requestPromise({
      action: 'info'
    });
    iohandler.stdout(`Online players: ${r.online}`);
    return 0;
  }
}
