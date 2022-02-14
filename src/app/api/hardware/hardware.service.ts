import {Injectable} from '@angular/core';
import {WebsocketService} from '../../websocket.service';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Part, PartCategory} from './hardware-parts';
import {DeviceHardware} from './device-hardware';
import {HardwareList} from './hardware-list';

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

      this.hardwareAvailable = new HardwareList(data);
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
    return this.webSocket.ms('device', ['device', 'info'], {device_uuid: device}).pipe(
      switchMap(data => this.getAvailableParts().pipe(map(() => data))),  // retrieve available parts if not saved yet
      map(data => {
        const hardware = new DeviceHardware(data);

        for (const {hardware_element, hardware_type} of data['hardware']) {
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
      })
    );
  }


}
