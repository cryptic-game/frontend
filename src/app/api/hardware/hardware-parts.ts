export enum PartCategory {
  MAINBOARD,
  CPU,
  PROCESSOR_COOLER,
  GPU,
  RAM,
  DISK,
  POWER_PACK,
  CASE
}

export interface Part {
  name?: string;
  category?: PartCategory;
  id: number;
}

export interface Mainboard extends Part {
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

export interface CPU extends Part {
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

export interface ProcessorCooler extends Part {
  'id': number;
  'coolerSpeed': number;
  'socket': string;
  'power': number;
}

export interface RAM extends Part {
  'id': number;
  'ramSize': number;
  'ramTyp': [string, number];
  'frequency': number;
  'power': number;
}

export interface GPU extends Part {
  'id': number;
  'ramSize': number;
  'ramTyp': [string, number];
  'frequency': number;
  'interface': [string, number];
  'power': number;
}

export interface Disk extends Part {
  'id': number;
  'diskTyp': string;
  'capacity': number;
  'writingSpeed': number;
  'readingSpeed': number;
  'interface': [string, number];
  'power': number;
}

export interface PowerPack extends Part {
  'id': number;
  'totalPower': number;
}

export interface Case extends Part {
  'id': number;
  'size': 'small' | 'middle' | 'big';
}
