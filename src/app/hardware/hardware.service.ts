@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  hardwareAvailable: HardwareList = new HardwareList();

  constructor(private webSocket: WebsocketService) {
    this.updateParts();
  }

  updateParts() {
    this.webSocket.ms('device', ['hardware', 'list'], {}).subscribe((data: HardwareList) => {
      if (data != null && data['error'] == null) {
        this.hardwareAvailable = data;
      }
    });
  }

  getAvailableParts(): HardwareList {
    return this.hardwareAvailable;
  }

  getDeviceParts(device: string): Observable<DeviceHardware> {
    return this.webSocket.ms('device', ['device', 'info'], { device_uuid: device }).pipe(map(data => {
      let mainboard: Parts.Mainboard;
      let cpu: Parts.CPU;
      let gpu: Parts.GPU;
      const ram: Parts.RAM[] = [];
      const disks: Parts.Disk[] = [];

      if (data['hardware'] instanceof Array) {
        for (const { hardware_element, hardware_type } of data['hardware']) {
          switch (hardware_type) {
            case 'mainboard':
              mainboard = this.hardwareAvailable.mainboards[hardware_element];
              break;
            case 'cpu':
              cpu = this.hardwareAvailable.cpu[hardware_element];
              break;
            case 'gpu':
              gpu = this.hardwareAvailable.gpu[hardware_element];
              break;
            case 'ram':
              ram.push(this.hardwareAvailable.ram[hardware_element]);
              break;
            case 'disk':
              disks.push(this.hardwareAvailable.disk[hardware_element]);
              break;
            default:
              console.warn('Unknown hardware part type: ' + hardware_type);
          }
        }
      } else {
        return new DeviceHardware();
      }

      return {
        mainboard: mainboard,
        cpu: cpu,
        gpu: gpu,
        ram: ram,
        disk: disks
      };
    }));
  }


}

import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

namespace Parts {
  export interface Mainboard {
    'name': string;
    'case': string;
    'sockel': string;
    'coreTemperatureControl': boolean;
    'usbPorts': number;
    'power': number;
    'ram': { 'ramSlots': number, 'ramSize': number, 'typ': string, 'frequency': number[] };
    'graphicUnit': { 'onBoard': boolean, 'interfaceSlots': null /* TODO: ? */, 'interface': string };
    'diskStorage': { 'hdSlots': number, 'typ': string, 'interface': string };
    'networkCard': { 'name': string, 'interface': string, 'speed': number };
  }

  export interface CPU {
    'name': string;
    'frequencyMin': number;
    'frequencyMax': number;
    'socket': string;
    'cores': number;
    'turboSpeed': boolean;
    'overClock': boolean;
    'maxTemperature': number;
    'power': number;
    'graphicUnitExist': boolean;
    'graphicUnit': {
      'name': string;
      'ramSize': number;
      'frequency': number;
    };
  }

  export interface GPU {
    'name': string;
    'ramSize': number;
    'ramTyp': string;
    'frequency': number;
    'interface': string;
    'power': number;
  }

  export interface RAM {
    'name': string;
    'ramSize': number;
    'ramTyp': string;
    'frequency': number;
    'power': number;
  }

  export interface Disk {
    'name': string;
    'diskTyp': string;
    'capacity': number;
    'writingSpeed': number;
    'readingSpeed': number;
    'interface': string;
    'power': number;
  }

  export interface ProcessorCooler {
    'name': string;
    'coolerSpeed': number;
    'sockel': string;
    'power': number;
  }

  export interface PowerPack {
    'name': string;
    'totalPower': number;
  }

  export interface Case {
    'name': string;
  }
}

export class DeviceHardware {
  'mainboard': Parts.Mainboard = {
    'name': '',
    'case': '',
    'sockel': '',
    'coreTemperatureControl': false,
    'usbPorts': 0,
    'power': 0,
    'ram': { 'ramSlots': 0, 'ramSize': 0, 'typ': '', 'frequency': [] },
    'graphicUnit': { 'onBoard': false, 'interfaceSlots': null /* TODO: ? */, 'interface': '' },
    'diskStorage': { 'hdSlots': 0, 'typ': '', 'interface': '' },
    'networkCard': { 'name': '', 'interface': '', 'speed': 0 },
  };
  'cpu': Parts.CPU = {
    'name': '',
    'cores': 0,
    'frequencyMax': 0,
    'frequencyMin': 0,
    'graphicUnit': { name: '', frequency: 0, ramSize: 0 },
    'graphicUnitExist': false,
    'maxTemperature': 0,
    'overClock': false,
    'power': 0,
    'socket': '',
    'turboSpeed': false
  };
  'gpu': Parts.GPU = {
    'name': '',
    'frequency': 0,
    'interface': '',
    'power': 0,
    'ramSize': 0,
    'ramTyp': ''
  };
  'ram': Parts.RAM[] = [];
  'disk': Parts.Disk[] = [];
}

export class HardwareList {
  'start_pc': {
    'motherboard': string,
    'cpu': string,
    'gpu': string,
    'ram': string[],
    'disk': string[]
  } = {
    motherboard: '',
    cpu: '',
    gpu: '',
    ram: [],
    disk: []
  };

  'mainboards': { [name: string]: Parts.Mainboard } = {};

  'cpu': { [name: string]: Parts.CPU } = {};

  'processorCooler': Parts.ProcessorCooler[] = [];

  'ram': { [name: string]: Parts.RAM } = {};

  'gpu': { [name: string]: Parts.GPU } = {};

  'disk': { [name: string]: Parts.Disk } = {};

  'powerPack': Parts.PowerPack[] = [];

  'case': Parts.Case[] = [];

}
