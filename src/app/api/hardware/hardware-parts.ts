export interface Mainboard {
  'name'?: string;

  'id': number;
  'case': string;
  'cpuSocket': string;
  'cpuSlots': number;
  'coreTemperatureControl': boolean;
  'usbPorts': number;
  'ram': { 'ramSlots': number, 'maxRamSize': number, 'ramTyp': [string, number][], 'frequency': number[] };
  'graphicUnitOnBoard'?: { 'name': string, 'ramSize': number, 'frequency': number };
  'expansionSlots': { 'interface': [string, number], 'interfaceSlots': number }[];
  'diskStorage': { 'diskSlots': number, 'interface': [string, number][] };
  'networkPort': { 'name': string, 'interface': string, 'speed': number };
  'power': number;
}

export interface CPU {
  'name'?: string;

  'id': number;
  'frequencyMin': number;
  'frequencyMax': number;
  'socket': string;
  'cores': number;
  'turboSpeed': boolean;
  'overClock': boolean;
  'maxTemperature': number;
  'graphicUnit'?: {
    'name': string;
    'ramSize': number;
    'frequency': number;
  };
  'power': number;
}

export interface ProcessorCooler {
  'name'?: string;

  'id': number;
  'coolerSpeed': number;
  'socket': string;
  'power': number;
}

export interface RAM {
  'name'?: string;

  'id': number;
  'ramSize': number;
  'ramTyp': [string, number];
  'frequency': number;
  'power': number;
}

export interface GPU {
  'name'?: string;

  'id': number;
  'ramSize': number;
  'ramTyp': [string, number];
  'frequency': number;
  'interface': [string, number];
  'power': number;
}

export interface Disk {
  'name'?: string;

  'id': number;
  'diskTyp': string;
  'capacity': number;
  'writingSpeed': number;
  'readingSpeed': number;
  'interface': [string, number];
  'power': number;
}

export interface PowerPack {
  'name'?: string;

  'id': number;
  'totalPower': number;
}
