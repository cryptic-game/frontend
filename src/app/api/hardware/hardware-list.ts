import * as Parts from './hardware-parts';
import { Part } from './hardware-parts';

export class HardwareList {
  'start_pc': {
    'mainboard': string;
    'cpu': string[];
    'processorCooler': string[];
    'gpu': string[];
    'ram': string[];
    'disk': string[];
    'powerPack': string;
    'case': string;
  } = {
    'mainboard': '',
    'cpu': [],
    'processorCooler': [],
    'gpu': [],
    'ram': [],
    'disk': [],
    'powerPack': '',
    'case': '',
  };

  'mainboard': { [name: string]: Parts.Mainboard } = {};

  'cpu': { [name: string]: Parts.CPU } = {};

  'processorCooler': { [name: string]: Parts.ProcessorCooler } = {};

  'ram': { [name: string]: Parts.RAM } = {};

  'gpu': { [name: string]: Parts.GPU } = {};

  'disk': { [name: string]: Parts.Disk } = {};

  'powerPack': { [name: string]: Parts.PowerPack } = {};

  'case': { [name: string]: Parts.Case } = {};


  constructor(availableParts: Partial<HardwareList> = {}) {
    Object.assign(this, availableParts);
  }

  getAllParts(): { [name: string]: Part } {
    return {
      ...this.case, ...this.powerPack, ...this.disk, ...this.gpu,
      ...this.ram, ...this.processorCooler, ...this.cpu, ...this.mainboard
    };
  }

  getByName(name: string): Part {
    return this.getAllParts()[name];
  }

  getByID(id: number): Part {
    return Object.values(this.getAllParts()).find(part => part.id === id)!;
  }

}
