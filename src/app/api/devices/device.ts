export interface Device {
  uuid: string;
  name: string;
  owner: string;
  powered_on: boolean;
  starter_device: boolean;
}

export interface DeviceWithHardware extends Device {
  hardware: {
    uuid: string;
    device_uuid: string;
    hardware_element: string;
    hardware_type: string;
  }[];
}

export class DeviceResources {
  uuid = '';
  performance_cpu = 0;
  performance_ram = 0;
  performance_gpu = 0;
  performance_disk = 0;
  performance_network = 0;
  usage_cpu = 0;
  usage_ram = 0;
  usage_gpu = 0;
  usage_disk = 0;
  usage_network = 0;

  // temperature = 0;  // later

  constructor(init: Partial<DeviceResources> = {}) {
    Object.assign(this, init);
  }

  relativeUsage(): ResourceUsage {
    return new ResourceUsage({
      cpu: Math.min(this.usage_cpu / this.performance_cpu, 1),
      gpu: Math.min(this.usage_gpu / this.performance_gpu, 1),
      ram: Math.min(this.usage_ram / this.performance_ram, 1),
      disk: Math.min(this.usage_disk / this.performance_disk, 1),
      network: Math.min(this.usage_network / this.performance_network, 1),
    });
  }
}

export class ResourceUsage {
  cpu = 0;
  gpu = 0;
  ram = 0;
  disk = 0;
  network = 0;

  constructor(init: Partial<ResourceUsage> = {}) {
    Object.assign(this, init);
  }

  relativeToDevice(resources: DeviceResources): ResourceUsage {
    return new ResourceUsage({
      cpu: this.cpu / resources.performance_cpu,
      gpu: this.gpu / resources.performance_gpu,
      ram: this.ram / resources.performance_ram,
      disk: this.disk / resources.performance_disk,
      network: this.network / resources.performance_network,
    });
  }

  average() {
    return (this.cpu + this.gpu + this.ram + this.disk + this.network) / 5;
  }
}
