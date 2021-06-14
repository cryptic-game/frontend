import {Command, IOHandler, ArgType} from '../command';
import {ShellApi} from '../shellapi';
import {Path} from 'src/app/api/files/path';
import {File} from 'src/app/api/files/file';

export class Dl extends Command {
  constructor(shellApi: ShellApi) {
    super('dl', shellApi);
    this.addDescription('download a file to your own device');
    this.addPositionalArgument({name: 'source', argType: ArgType.FILE});
    this.addPositionalArgument({name: 'destination'});
  }

  async run(iohandler: IOHandler): Promise<number> {
    let srcFile: File;
    let dstPath: Path;
    const ownerUuid = this.shellApi.terminal.getOwnerDevice()['uuid'];
    try {
      const srcPath = Path.fromString(iohandler.positionalArgs[0], this.shellApi.working_dir);
      srcFile = await this.shellApi.fileService.getFromPath(this.shellApi.activeDevice['uuid'], srcPath).toPromise();
    } catch {
      iohandler.stderr('The source file was not found');
      return 1;
    }
    if (srcFile.is_directory) {
      iohandler.stderr('Cannot download a directory');
      return 1;
    }
    try {
      dstPath = Path.fromString(iohandler.positionalArgs[1], this.shellApi.working_dir);
    } catch {
      iohandler.stderr('The specified destination path is not valid');
      return 1;
    }

    try {
      await this.shellApi.fileService.getFromPath(ownerUuid, dstPath).toPromise();
      iohandler.stderr('That file already exists');
      return 1;
    } catch {}

    const dstFileName = dstPath.path[dstPath.path.length - 1];
    try {
      await this.shellApi.fileService.createFile(ownerUuid, dstFileName, srcFile.content, dstPath.parentUUID).toPromise();
      return 0;
    } catch {
      iohandler.stderr('Could not create file');
      return 1;
    }
  }
}
