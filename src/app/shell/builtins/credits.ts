import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Credits extends Command {
  constructor(shellApi: ShellApi) {
    super('credits', shellApi);
    this.addDescription('list all contributors');
  }

  async run(iohandler: IOHandler): Promise<number> {
    const data = await fetch('https://api.admin.staging.cryptic-game.net/website/team');
    const members = JSON.parse(await data.text()).sort(() => Math.random() - 0.5);
    members.forEach((member: any) => {
      iohandler.stdout(member.name);
    });
    return 0;
  }
}
