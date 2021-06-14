import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Credits extends Command {
  constructor(shellApi: ShellApi) {
    super('credits', shellApi);
    this.addDescription('list all contributors');
  }

  async run(iohandler: IOHandler): Promise<number> {
    let data: any;
    try {
      data = await (await fetch('https://api.admin.staging.cryptic-game.net/website/team')).json();
    } catch (e) {
      // this will catch errors related to CORS
      iohandler.stderr("Cannot fetch credits");
      return 1;
    }
    const members = data.sort(() => Math.random() - 0.5);
    members.forEach((member: any) => {
      iohandler.stdout(member.name);
    });
    return 0;
  }
}
