export interface Device {
  uuid: string;
  name: string;
  owner: string;
  powered_on: boolean;
}

export interface DeviceWithHardware extends Device {
  hardware: {
    uuid: string,
    device_uuid: string,
    hardware_element: string,
    hardware_type: string
  }[];
}

export class DeviceUtilization {
  cpu = 0;
  gpu = 0;
  ram = 0;
  disk = 0;
  network = 0;

  // temperature = 0;  // later

  constructor(init: Partial<DeviceUtilization> = {}) {
    Object.assign(this, init);
  }

  average() {
    return (this.cpu + this.gpu + this.ram + this.disk + this.network) / 5;
  }
}
