import { inject, TestBed } from '@angular/core/testing';

import { DeviceHardware, HardwareList, HardwareService } from './hardware.service';
import { WebsocketService } from '../../websocket.service';
import * as rxjs from 'rxjs';
import { throwError } from 'rxjs';

describe('HardwareService', () => {
  let webSocket;

  beforeEach(() => {
    webSocket = jasmine.createSpyObj('WebsocketService', ['ms']);
    webSocket.ms.and.returnValue(rxjs.of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocket },
        HardwareService
      ]
    });
  });

  it('should be created',
    inject([HardwareService], (service: HardwareService) => {
      expect(service).toBeTruthy();
    }));

  it('#updateParts() should call /hardware/list and save the hardware parts in a variable if there was no error',
    inject([HardwareService], (service: HardwareService) => {
      const data = new HardwareList();
      data.ram['test'] = {
        id: 156,
        ramSize: 987,
        ramTyp: ['test-type', 4],
        frequency: 123,
        power: 321,
      };
      const msSpy = webSocket.ms.and.returnValue(rxjs.of(data));
      service.hardwareAvailable = null;

      service.updateParts();
      expect(service.hardwareAvailable).toEqual(data);
      expect(msSpy).toHaveBeenCalledWith('device', ['hardware', 'list'], {});
    }));

  it('#updateParts() should call /hardware/list and do nothing if there was an error',
    inject([HardwareService], (service: HardwareService) => {
      service.hardwareAvailable = null;
      const msSpy = webSocket.ms.and.callFake(() => throwError(new Error('Test error')));

      service.updateParts();
      expect(service.hardwareAvailable).toEqual(null);
      expect(msSpy).toHaveBeenCalledWith('device', ['hardware', 'list'], {});
    }));

  it('#getHardwareParts() should return the saved hardware parts',
    inject([HardwareService], (service: HardwareService) => {
      const hardware = new HardwareList();
      hardware.ram['test'] = {
        id: 156,
        ramSize: 987,
        ramTyp: ['test-type', 4],
        frequency: 123,
        power: 321,
      };
      service.hardwareAvailable = hardware;

      expect(service.getAvailableParts()).toEqual(hardware);
    }));

  it('#getDeviceParts() should call /device/info and return the corresponding hardware parts from hardwareAvailable',
    inject([HardwareService], (service: HardwareService) => {
      const inputData = {
        hardware: [
          { hardware_element: 'test_mainboard', hardware_type: 'mainboard' },
          { hardware_element: 'test_cpu', hardware_type: 'cpu' },
          { hardware_element: 'test_gpu1', hardware_type: 'gpu' },
          { hardware_element: 'test_gpu2', hardware_type: 'gpu' },
          { hardware_element: 'test_ram1', hardware_type: 'ram' },
          { hardware_element: 'test_ram2', hardware_type: 'ram' },
          { hardware_element: 'test_disk1', hardware_type: 'disk' },
          { hardware_element: 'test_disk2', hardware_type: 'disk' },
          { hardware_element: 'test_non_existing', hardware_type: 'non-existing' },
          { hardware_element: 'test_cooler', hardware_type: 'processorCooler' },
          { hardware_element: 'test_psu', hardware_type: 'powerPack' },
          { hardware_element: 'test_case', hardware_type: 'case' }
        ]
      };
      const expected = new DeviceHardware();
      Object.assign(expected, {
        'mainboard': { test: '1235352326' },
        'cpu': [{ test: '2495229568' }],
        'gpu': [{ test: '2189593264' }, { test: '1214895938' }],
        'ram': [{ test: '8962369692' }, { test: '5841536296' }],
        'disk': [{ test: '6442812494' }, { test: '3385206386' }],
        'processorCooler': [{ test: '9981571654' }],
        'powerPack': { test: '1684526384' },
        'case': 'test_case'
      });

      service.hardwareAvailable = {
        mainboard: { test_mainboard: expected.mainboard },
        cpu: { test_cpu: expected.cpu[0] },
        gpu: { test_gpu1: expected.gpu[0], test_gpu2: expected.gpu[1] },
        ram: { test_ram1: expected.ram[0], test_ram2: expected.ram[1] },
        disk: { test_disk1: expected.disk[0], test_disk2: expected.disk[1] },
        processorCooler: { test_cooler: expected.processorCooler[0] },
        powerPack: { test_psu: expected.powerPack }
      } as any;

      const warnSpy = spyOn(console, 'warn');

      const msSpy = webSocket.ms.and.returnValue(rxjs.of(inputData));
      const testUUID = '00000000-0000-0000-0000-000000000000';

      const devicePartsObservable = service.getDeviceParts(testUUID);
      expect(msSpy).toHaveBeenCalledWith('device', ['device', 'info'], { device_uuid: testUUID });
      devicePartsObservable.subscribe(data => {
        expect(data as any).toEqual(expected);
        expect(warnSpy).toHaveBeenCalledTimes(1);
      });
    }));

  it('#getDeviceParts() should return an empty new DeviceHardware if the response from /device/info is invalid',
    inject([HardwareService], (service: HardwareService) => {
      const msSpy = webSocket.ms.and.callFake(() => throwError(new Error(('Test error'))));

      service.getDeviceParts('00000000-0000-0000-0000-000000000000').subscribe(data => {
        expect(msSpy).toHaveBeenCalled();
        expect(data).toEqual(new DeviceHardware());
      });
    }));

});
