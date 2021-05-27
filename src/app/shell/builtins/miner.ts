import {Command, IOHandler} from '../command';
import {ShellApi} from '../shellapi';

export class Miner extends Command {
  constructor(shellApi: ShellApi) {
    super('miner', shellApi);
    this.addDescription('mangages morphcoin miners');
    this.addSubcommand(MinerLook);
    this.addSubcommand(MinerWallet);
    this.addSubcommand(MinerPower);
    this.addSubcommand(MinerStart);
  }

  async run(iohandler: IOHandler): Promise<number> {
    this.showHelp(iohandler.stderr);
    return 1;
  }
}

async function getMinerService(shellApi: ShellApi): Promise<any> {
  const listData = await shellApi.websocket.msPromise('service', ['list'], {
    'device_uuid': shellApi.activeDevice['uuid'],
  });
  for (const service of listData.services) {
    if (service.name === 'miner') {
      return service;
    }
  }
  throw new Error('miner service not found');
}

class MinerLook extends Command {
  constructor(shellApi: ShellApi) {
    super('look', shellApi);
    this.addDescription('shows your current miner settings');
  }

  async run(iohandler: IOHandler): Promise<number> {
    let miner: any;
    try {
      miner = await getMinerService(this.shellApi);
    } catch {
      iohandler.stderr('Miner service not reachable');
      return 1;
    }
    const data = await this.shellApi.websocket.msPromise('service', ['miner', 'get'], {
      'service_uuid': miner.uuid,
    });
    const wallet = data['wallet'];
    const power = Math.round(data['power'] * 100);
    iohandler.stdout('Wallet: ' + wallet);
    iohandler.stdout('Mining Speed: ' + String(Number(miner.speed) * 60 * 60) + ' MC/h');
    iohandler.stdout('Power: ' + power + '%');
    return 0;
  }
}

class MinerWallet extends Command {
  constructor(shellApi: ShellApi) {
    super('wallet', shellApi);
    this.addDescription('set the miner to a wallet');
    this.addPositionalArgument({name: 'wallet-id'});
  }

  async run(iohandler: IOHandler): Promise<number> {
    let miner: any;
    try {
      miner = await getMinerService(this.shellApi);
    } catch {
      iohandler.stderr('Miner service not reachable');
      return 1;
    }
    try {
      const newWallet = iohandler.positionalArgs[0];
      await this.shellApi.websocket.msPromise('service', ['miner', 'wallet'], {
        'service_uuid': miner.uuid,
        'wallet_uuid': newWallet,
      });
      iohandler.stdout(`Set wallet to ${newWallet}`);
      return 0;
    } catch {
      iohandler.stderr('Wallet is invalid.');
      return 1;
    }
  }
}

class MinerPower extends Command {
  constructor(shellApi: ShellApi) {
    super('power', shellApi);
    this.addDescription('set the power of your miner');
    // TODO add validators
    this.addPositionalArgument({name: '<0-100>'});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    let miner: any;
    try {
      miner = await getMinerService(this.shellApi);
    } catch {
      iohandler.stderr('Miner service not reachable');
      return 1;
    }
    if (args.length !== 1 || isNaN(Number(args[0])) || 0 > Number(args[0]) || Number(args[0]) > 100) {
      this.showHelp(iohandler.stderr);
      return 1;
    }
    await this.shellApi.websocket.msPromise('service', ['miner', 'power'], {
      'service_uuid': miner.uuid,
      'power': Number(args[1]) / 100,
    });
    iohandler.stdout(`Set Power to ${args[0]}`);
    return 0;
  }
}


class MinerStart extends Command {
  constructor(shellApi: ShellApi) {
    super('start', shellApi);
    this.addDescription('start the miner');
    this.addPositionalArgument({name: 'wallet-id'});
  }

  async run(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    try {
        await this.shellApi.websocket.msPromise('service', ['create'], {
          'device_uuid': this.shellApi.activeDevice['uuid'],
          'name': 'miner',
          'wallet_uuid': args[0],
        });
        return 0;
    } catch {
      iohandler.stderr('Invalid wallet');
      return 1;
    }
  }
}


