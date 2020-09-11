import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { Device, DeviceUtilization, DeviceWithHardware } from './device';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private webSocket: WebsocketService) {
  }

  getDeviceInfo(deviceUUID): Observable<DeviceWithHardware> {
    return this.deviceRequest(['device', 'info'], { device_uuid: deviceUUID });
  }

  getDeviceState(deviceUUID): Observable<{ online: boolean }> {
    return this.deviceRequest(['device', 'ping'], { device_uuid: deviceUUID });
  }

  getDevices(): Observable<{ devices: Device[] }> {
    return this.deviceRequest(['device', 'all'], {});
  }

  createDevice(hardware: DeviceHardwareSpec): Observable<Device> {
    return this.deviceRequest(['device', 'create'], hardware);
  }

  createStarterDevice(): Observable<Device> {
    return this.deviceRequest(['device', 'starter_device'], {});
  }

  togglePower(deviceUUID: string): Observable<Device> {
    return this.deviceRequest(['device', 'power'], { device_uuid: deviceUUID });
  }

  renameDevice(deviceUUID: string, newName: string): Observable<Device> {
    return this.deviceRequest(['device', 'change_name'], { device_uuid: deviceUUID, name: newName });
  }

  deleteDevice(deviceUUID: string): Observable<{ ok: true }> {
    return this.deviceRequest(['device', 'delete'], { device_uuid: deviceUUID });
  }

  getRandomDevice(): Observable<Device> {
    return this.deviceRequest(['device', 'spot'], {});
  }

  checkHardwareCompatibility(hardware: DeviceHardwareSpec): Observable<{
    success: true,
    performance: [number, number, number, number, number]
  }> {
    return this.deviceRequest(['hardware', 'build'], hardware);
  }

  getResourceUsage(deviceUUID): Observable<DeviceUtilization> {
    return this.deviceRequest(['hardware', 'resources'], { device_uuid: deviceUUID });
  }

  getServiceResourceUsage(serviceUUID): Observable<DeviceUtilization> {
    return this.deviceRequest(['hardware', 'process'], { service_uuid: serviceUUID });
  }

  private deviceRequest<T>(endpoint: string[], data: object): Observable<T> {
    return this.webSocket.ms('device', endpoint, data);
  }

}

export interface DeviceHardwareSpec {
  'case': string;
  'mainboard': string;
  'cpu': string[];
  'processorCooler': string[];
  'ram': string[];
  'gpu': string[];
  'disk': string[];
  'powerPack': string;
}
