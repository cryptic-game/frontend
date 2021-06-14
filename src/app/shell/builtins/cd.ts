import {Command, IOHandler, ArgType} from '../command';
import {ShellApi} from '../shellapi';
import {Path} from 'src/app/api/files/path';

export class Cd extends Command {
  constructor(shellApi: ShellApi) {
    super('cd', shellApi);
    this.addDescription('changes the working directory');
    this.addPositionalArgument({name: 'directory', optional: true, argType: ArgType.DIRECTORY});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    const input = args.length === 1 ? args[0] : '/';
    let path: Path;
    try {
      path = Path.fromString(input, this.shellApi.working_dir);
    } catch {
      iohandler.stderr('The specified path is not valid');
      return 1;
    }
    let file: any;
    try {
      file = await this.shellApi.fileService.getFromPath(this.shellApi.activeDevice['uuid'], path).toPromise();
    } catch (error) {
      if (error.message === 'file_not_found') {
        iohandler.stderr('That directory does not exist');
        return 2;
      } else {
        this.reportError(error);
        return 1;
      }
    }
    if (file.is_directory) {
      this.shellApi.working_dir = file.uuid;
      this.shellApi.refreshPrompt();
      return 0;
    } else {
      iohandler.stderr('That is not a directory');
      return 1;
    }
  }
}
