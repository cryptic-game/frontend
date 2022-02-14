import * as Parts from './hardware-parts';
import { PartCategory } from './hardware-parts';
import { Device } from '../devices/device';

export class DeviceHardware {
  'mainboard': Parts.Mainboard = {
    'name': '',
    'category': PartCategory.MAINBOARD,
    'id': 0,
    'case': '',
    'cpuSocket': '',
    'cpuSlots': 0,
    'coreTemperatureControl': false,
    'usbPorts': 0,
    'ram': { 'ramSlots': 0, 'maxRamSize': 0, 'ramTyp': [], 'frequency': [] },
    'graphicUnitOnBoard': null!,
    'expansionSlots': [],
    'diskStorage': { 'diskSlots': 0, 'interface': [] },
    'networkPort': { 'name': '', 'interface': '', 'speed': 0 },
    'power': 0
  };
  'cpu': Parts.CPU[] = [];
  'gpu': Parts.GPU[] = [];
  'ram': Parts.RAM[] = [];
  'disk': Parts.Disk[] = [];
  'processorCooler': Parts.ProcessorCooler[] = [];
  'powerPack': Parts.PowerPack = {
    'name': '',
    'category': PartCategory.POWER_PACK,
    'id': 0,
    'totalPower': 0
  };
  'case': Parts.Case = {
    'name': '',
    'id': 0,
    'size': 'small'
  };

  constructor(public device: Device, parts: Partial<DeviceHardware> = {}) {
    Object.assign(this, parts);
  }

  getTotalMemory(): number {
    return this.ram.reduce((previousValue, currentValue) => previousValue + currentValue.ramSize, 0);
  }

}
