import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as Parts from './hardware-parts';
import { Part, PartCategory } from './hardware-parts';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  hardwareAvailable: HardwareList;

  constructor(private webSocket: WebsocketService) {
  }

  updateParts(): Observable<void> {
    return this.webSocket.ms('device', ['hardware', 'list'], {}).pipe(map((data: HardwareList) => {
      for (const [parts, category] of [
        [data.mainboard, PartCategory.MAINBOARD],
        [data.cpu, PartCategory.CPU],
        [data.gpu, PartCategory.GPU],
        [data.ram, PartCategory.RAM],
        [data.disk, PartCategory.DISK],
        [data.processorCooler, PartCategory.PROCESSOR_COOLER],
        [data.powerPack, PartCategory.POWER_PACK],
        [data.case, PartCategory.CASE]
      ] as [{ [name: string]: Part }, PartCategory][]) {
        if (parts) {
          for (const [name, part] of Object.entries(parts)) {
            part.name = name;
            part.category = category;
          }
        }
      }

      this.hardwareAvailable = new HardwareList();
      Object.assign(this.hardwareAvailable, data);
    }));
  }

  getAvailableParts(): Observable<HardwareList> {
    if (this.hardwareAvailable) {
      return of(this.hardwareAvailable);
    } else {
      return this.updateParts().pipe(map(() => this.hardwareAvailable));
    }
  }

  getDeviceParts(device: string): Observable<DeviceHardware> {
    return this.webSocket.ms('device', ['device', 'info'], { device_uuid: device }).pipe(
      switchMap(data => this.getAvailableParts().pipe(map(() => data))),
      map(data => {
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
              hardware.case = this.hardwareAvailable.case[hardware_element];
              break;
            default:
              console.warn('Unknown hardware part type: ' + hardware_type);
          }
        }

        return hardware;
      }), catchError(() => {
        return of(new DeviceHardware());
      })
    );
  }


}


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
    'name': '',
    'category': PartCategory.POWER_PACK,
    'id': 0,
    'totalPower': 0
  };
  'case': Parts.Case = { id: 0, size: 'small' };

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

  'case': { [name: string]: Parts.Case } = {};

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
    return Object.values(this.getAllParts()).find(part => part.id === id);
  }

}
