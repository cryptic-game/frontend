import {Command, IOHandler} from '../command';
import {Device} from '../../api/devices/device';
import {ShellApi} from '../shellapi';

export class Hostname extends Command {
  constructor(shellApi: ShellApi) {
    super('hostname', shellApi);
    this.addDescription('changes the name of the device');
    this.addPositionalArgument({name: 'name', optional: true});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    if (args.length === 1) {
      const hostname = args[0];
      let newDevice: Device;
      try {
        newDevice = await this.shellApi.websocket.ms('device', ['device', 'change_name'], {
          device_uuid: this.shellApi.activeDevice['uuid'],
          name: hostname
        }).toPromise();
      } catch {
        iohandler.stderr('The hostname couldn\'t be changed');
        return 1;
      }
      this.shellApi.activeDevice = newDevice;
      this.shellApi.refreshPrompt();

      if (this.shellApi.activeDevice.uuid === this.shellApi.windowDelegate.device.uuid) {
        Object.assign(this.shellApi.windowDelegate.device, newDevice);
      }
    } else {
      let device: Device;
      try {
        device = await this.shellApi.websocket.ms(
          'device',
          ['device', 'info'],
          {device_uuid: this.shellApi.activeDevice['uuid']}
        ).toPromise();
      } catch {
        iohandler.stdout(this.shellApi.activeDevice['name']);
      }
      if (device['name'] !== this.shellApi.activeDevice['name']) {
        this.shellApi.activeDevice = device;
        this.shellApi.refreshPrompt();
      }
      iohandler.stdout(device['name']);
    }
    return 0;
  }
}
