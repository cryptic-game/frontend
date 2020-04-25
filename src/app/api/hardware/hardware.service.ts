import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Parts from './hardware-parts';

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
      this.hardwareAvailable = data;
      for (const partCategory of [
        data.mainboard,
        data.cpu,
        data.gpu,
        data.ram,
        data.disk,
        data.processorCooler,
        data.powerPack
      ]) {
        if (partCategory) {
          for (const [name, part] of Object.entries(partCategory)) {
            part.name = name;
          }
        }
      }
    }, () => {
    });
  }

  getAvailableParts(): HardwareList {
    return this.hardwareAvailable;
  }

  getDeviceParts(device: string): Observable<DeviceHardware> {
    return this.webSocket.ms('device', ['device', 'info'], { device_uuid: device }).pipe(map(data => {
      const hardware = new DeviceHardware();

      for (const { hardware_element, hardware_type } of data['hardware']) {
        switch (hardware_type) {
          case 'mainboard':
            hardware.mainboard = this.hardwareAvailable.mainboard[hardware_element];
            break;
          case 'cpu':
            hardware.cpu.push(this.hardwareAvailable.cpu[hardware_element]);
            break;
          case 'gpu':
            hardware.gpu.push(this.hardwareAvailable.gpu[hardware_element]);
            break;
          case 'ram':
            hardware.ram.push(this.hardwareAvailable.ram[hardware_element]);
            break;
          case 'disk':
            hardware.disk.push(this.hardwareAvailable.disk[hardware_element]);
            break;
          case 'processorCooler':
            hardware.processorCooler.push(this.hardwareAvailable.processorCooler[hardware_element]);
            break;
          case 'powerPack':
            hardware.powerPack = this.hardwareAvailable.powerPack[hardware_element];
            break;
          case 'case':
            hardware.case = hardware_element;
            break;
          default:
            console.warn('Unknown hardware part type: ' + hardware_type);
        }
      }

      return hardware;
    }), catchError(() => {
      return of(new DeviceHardware());
    }));
  }


}


export class DeviceHardware {
  'mainboard': Parts.Mainboard = {
    'id': 0,
    'case': '',
    'cpuSocket': '',
    'cpuSlots': 0,
    'coreTemperatureControl': false,
    'usbPorts': 0,
    'ram': { 'ramSlots': 0, 'maxRamSize': 0, 'ramTyp': [], 'frequency': [] },
    'graphicUnitOnBoard': null,
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
    'id': 0,
    'totalPower': 0
  };
  'case': string;

  getTotalMemory(): number {
    return this.ram.reduce((previousValue, currentValue) => previousValue + currentValue.ramSize, 0);
  }
}

export class HardwareList {
  'start_pc': {
    'mainboard': string,
    'cpu': string[],
    'processorCooler': string[],
    'gpu': string[],
    'ram': string[],
    'disk': string[]
    'powerPack': string,
    'case': string
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

  'case': string[] = [];

}
