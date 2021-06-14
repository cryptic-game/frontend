import {Command, IOHandler, ArgType} from '../command';
import {ShellApi} from '../shellapi';

export class Ping extends Command {
  constructor(shellApi: ShellApi) {
    super('ping', shellApi);
    this.addDescription('ping a device');
    this.addPositionalArgument({name: 'uuid', argType: ArgType.UUID});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const uuid = iohandler.positionalArgs[0];
    try {
      const status = await this.shellApi.deviceService.getDeviceState(uuid).toPromise();
      iohandler.stdout(`Device is ${status.online ? '' : 'not '}online`);
      return 0;
    } catch {
      iohandler.stderr('Device not found');
      return 1;
    }
  }
}
