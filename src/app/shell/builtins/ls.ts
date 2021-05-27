import {Command, IOHandler, ArgType} from '../command';
import {ShellApi} from '../shellapi';
import {Path} from 'src/app/api/files/path';
import {File} from 'src/app/api/files/file';

export class Ls extends Command {
  constructor(shellApi: ShellApi) {
    super('ls', shellApi);
    this.addDescription('shows files of the current working directory');
    this.addPositionalArgument({name: 'path', optional: true, argType: ArgType.PATH});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    let files: File[];
    if (args.length === 0) {
      files = await this.shellApi.listFilesOfWorkingDir();
    } else {
      let path: Path;
      try {
        path = Path.fromString(args[0], this.shellApi.working_dir);
      } catch {
        iohandler.stderr('The specified path is not valid');
        return 1;
      }
      try {
        const target = await this.shellApi.fileService.getFromPath(this.shellApi.activeDevice['uuid'], path).toPromise();
        if (target.is_directory) {
          files = await this.shellApi.fileService.getFiles(this.shellApi.activeDevice['uuid'], target.uuid).toPromise();
        } else {
          files = [target];
        }
      } catch (error) {
        if (error.message === 'file_not_found') {
          iohandler.stderr('That directory does not exist');
          return 2;
        } else {
          this.reportError(error);
          return 1;
        }
      }
    }

    files.filter((file) => file.is_directory).sort().forEach(folder => {
      // TODO use escape codes
      iohandler.stdout(`<span style="color: ${this.shellApi.settings.getLSFC()};">${(this.shellApi.settings.getLSPrefix()) ? '[Folder] ' : ''}${folder.filename}</span>`);
    });

    files.filter((file) => !file.is_directory).sort().forEach(file => {
      iohandler.stdout(`${(this.shellApi.settings.getLSPrefix() ? '[File] ' : '')}${file.filename}`);
    });
    return 0;
  }
}
