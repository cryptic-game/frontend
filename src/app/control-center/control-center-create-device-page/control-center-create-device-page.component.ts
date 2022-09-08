import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceHardwareSpec, DeviceService } from '../../api/devices/device.service';
import {
  Case,
  CPU,
  Disk,
  GPU,
  Mainboard,
  Part,
  PartCategory,
  PowerPack,
  ProcessorCooler,
  RAM,
} from '../../api/hardware/hardware-parts';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { InventoryItemWithHardware } from '../../api/inventory/inventory-item';
import { ControlCenterService } from '../control-center.service';
import { Device } from '../../api/devices/device';

@Component({
  selector: 'app-control-center-create-device-page',
  templateUrl: './control-center-create-device-page.component.html',
  styleUrls: ['./control-center-create-device-page.component.scss'],
})
export class ControlCenterCreateDevicePageComponent {
  form: FormGroup;
  info: string;
  error: string;

  // available hardware parts in the inventory
  cases: Case[] = [];
  mainBoards: Mainboard[] = [];
  cpus: CPU[] = [];
  processorCoolers: ProcessorCooler[] = [];
  ramSticks: RAM[] = [];
  expansions: Expansion[] = [];
  disks: Disk[] = [];
  powerSupplies: PowerPack[] = [];

  // options and properties of the selects in the form arrays
  controlProperties: Map<FormControl, ControlProperties> = new Map<FormControl, ControlProperties>();

  constructor(
    private formBuilder: FormBuilder,
    private deviceService: DeviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public controlCenterService: ControlCenterService
  ) {
    this.form = this.formBuilder.group({
      case: [null, Validators.required],
      mainboard: [null, Validators.required],
      cpus: this.formBuilder.array([]),
      processorCoolers: this.formBuilder.array([]),
      ramSticks: this.formBuilder.array([]),
      expansions: this.formBuilder.array([]),
      disks: this.formBuilder.array([]),
      powerSupply: [null, Validators.required],
    });

    this.form.get('mainboard')!.valueChanges.subscribe((data) => this.updateFields(data));

    this.form.get('case')!.valueChanges.subscribe((data) => {
      // reset the mainboard when the case changes and is not compatible with the mainboard
      if (data == null || this.form.get('mainboard')!.value?.case !== data.name) {
        this.form.get('mainboard')!.setValue(null);
      }
    });

    this.activatedRoute.data.subscribe((items: Data) =>
      // @ts-ignore
      this.updateAvailableParts(items.inventoryItems)
    );
  }

  updateAvailableParts(items: InventoryItemWithHardware[]): any {
    this.cases = [];
    this.mainBoards = [];
    this.cpus = [];
    this.processorCoolers = [];
    this.ramSticks = [];
    this.expansions = [];
    this.disks = [];
    this.powerSupplies = [];

    items.forEach((item) => {
      const part = item.properties;

      switch (item.properties.category) {
        case PartCategory.CASE:
          this.cases.push(part as Case);
          break;
        case PartCategory.MAINBOARD:
          this.mainBoards.push(part as Mainboard);
          break;
        case PartCategory.CPU:
          this.cpus.push(part as CPU);
          break;
        case PartCategory.PROCESSOR_COOLER:
          this.processorCoolers.push(part as ProcessorCooler);
          break;
        case PartCategory.RAM:
          this.ramSticks.push(part as RAM);
          break;
        case PartCategory.GPU:
          this.expansions.push(part as GPU);
          break;
        case PartCategory.DISK:
          const disk = part as Disk;
          if (disk.interface[0] === 'SATA' || disk.interface[0] === 'IDE') {
            this.disks.push(disk);
          } else {
            this.expansions.push(disk);
          }
          break;
        case PartCategory.POWER_PACK:
          this.powerSupplies.push(part as PowerPack);
          break;
      }
    });

    this.updateFields(this.form.get('mainboard')!.value);
  }

  getFormArray(name: string): FormArray {
    return this.form.get(name) as FormArray;
  }

  getFormArrayControls(name: string): { control: FormControl; props: ControlProperties }[] {
    // @ts-ignore
    return (this.getFormArray(name).controls as FormControl[]).map((control) => ({
      control: control,
      props: this.controlProperties.get(control),
    }));
  }

  findControl(properties: ControlProperties): FormControl | null {
    for (const [key, value] of this.controlProperties.entries()) {
      if (controlPropertiesEqual(value, properties)) {
        return key;
      }
    }
    return null;
  }

  /**
   * Update the hardware selection fields based on compatibility with the mainboard
   * @param mainboard The new mainboard
   */
  updateFields(mainboard: Mainboard) {
    ['cpus', 'processorCoolers', 'ramSticks', 'expansions', 'disks']
      .map((name) => this.getFormArray(name))
      .forEach((formArray) => formArray.clear());

    this.info = '';
    this.error = '';

    if (mainboard == null) {
      return;
    }

    const newControl = (options: Part[], category: string, index: number, required: boolean, description?: string) => {
      const properties = { options, category, index, description };
      const control =
        this.findControl(properties) ?? this.formBuilder.control(null, required ? Validators.required : null);
      this.controlProperties.set(control, properties);
      return control;
    };

    const compatibleCPUs = this.cpus.filter((cpu) => cpu.socket === mainboard.cpuSocket);
    const compatibleCoolers = this.processorCoolers.filter((cooler) => cooler.socket === mainboard.cpuSocket);

    const compatibleRAM = this.ramSticks
      .filter((ramStick) => mainboard.ram.ramTyp.some((type) => arraysEqual(type, ramStick.ramTyp)))
      .filter((ramStick) => mainboard.ram.frequency.includes(ramStick.frequency));

    const compatibleDisks = this.disks.filter((disk) =>
      mainboard.diskStorage.interface.some((supported) => arraysEqual(disk.interface, supported))
    );

    for (let i = 0; i < mainboard.cpuSlots; i++) {
      this.getFormArray('cpus').push(newControl(compatibleCPUs, 'cpus', i, i === 0));
      this.getFormArray('processorCoolers').push(newControl(compatibleCoolers, 'processorCoolers', i, i === 0));
    }

    for (let i = 0; i < mainboard.ram.ramSlots; i++) {
      this.getFormArray('ramSticks').push(newControl(compatibleRAM, 'ramSticks', i, i === 0));
    }

    for (let i = 0; i < mainboard.diskStorage.diskSlots; i++) {
      this.getFormArray('disks').push(newControl(compatibleDisks, 'disks', i, i === 0));
    }

    for (const expansionInterface of mainboard.expansionSlots) {
      const compatibleExpansions = this.expansions.filter((expansion) =>
        arraysEqual(expansion.interface, expansionInterface.interface)
      );

      for (let i = 0; i < expansionInterface.interfaceSlots; i++) {
        this.getFormArray('expansions').push(
          newControl(compatibleExpansions, 'expansions', i, false, expansionInterface.interface.join(' '))
        );
      }
    }
  }

  getSelectedHardware(): DeviceHardwareSpec {
    const data = this.form.value;
    const nonNullNames = (parts: Part[]) => parts.filter((part) => part != null).map((part) => part.name);

    if (data.case == null) {
      throw new Error('missing_case');
    }
    if (data.mainboard == null) {
      throw new Error('missing_mainboard');
    }
    if (data.powerSupply == null) {
      throw new Error('missing_power_supply');
    }

    // @ts-ignore
    const disks: string[] = nonNullNames(data.disks).concat(
      nonNullNames(data.expansions.filter((x) => x?.category === PartCategory.DISK))
    );
    // @ts-ignore
    const gpus: string[] = nonNullNames(data.expansions.filter((x) => x?.category === PartCategory.GPU));

    return {
      case: data.case?.name,
      mainboard: data.mainboard?.name,
      // @ts-ignore
      cpu: nonNullNames(data.cpus),
      // @ts-ignore
      processorCooler: nonNullNames(data.processorCoolers),
      // @ts-ignore
      ram: nonNullNames(data.ramSticks),
      gpu: gpus,
      disk: disks,
      powerPack: data.powerSupply?.name,
    };
  }

  buildStarterDevice() {
    this.deviceService.createStarterDevice().subscribe((device) => {
      this.controlCenterService.refreshDevices().subscribe(() => {
        this.router.navigate(['/device'], { queryParams: { device: device.uuid } }).then();
      });
    });
  }

  displayError(error: Error) {
    this.info = '';

    const message = {
      missing_case: $localize`Missing case`,
      missing_mainboard: $localize`Missing mainboard`,
      missing_power_supply: $localize`Missing power supply`,

      missing_cpu: $localize`Missing CPU`,
      missing_ram: $localize`Missing RAM`,
      missing_disk: $localize`Missing disk`,
      invalid_amount_of_cpu_coolers: $localize`A CPU is missing a cooler`,
      insufficient_power_pack: $localize`The specified power supply is too weak for your configuration`,

      cpu_not_in_inventory: $localize`You specified a CPU item multiple times`,
      processorCooler_not_in_inventory: $localize`You specified a cooler item multiple times`,
      gpu_not_in_inventory: $localize`You specified a GPU item multiple times`,
      ram_not_in_inventory: $localize`You specified a RAM item multiple times`,
      disk_not_in_inventory: $localize`You specified a disk item multiple times`,

      missing_external_gpu: $localize`Your configuration requires an external GPU`,
      maximum_devices_reached: $localize`You already own the maximum number of devices`,
    }[error.message];

    if (message == null) {
      this.error = $localize`Unknown error: ${error.message}`;
    } else {
      this.error = message;
    }
  }

  checkCompatibility() {
    try {
      const selectedHardware = this.getSelectedHardware();

      this.deviceService.checkHardwareCompatibility(selectedHardware).subscribe({
        next: (result) => {
          console.log($localize`Performance: ${result.performance}`);
          this.error = '';
          this.info = $localize`The configuration is compatible`;
        },
        error: (err: Error) => {
          this.displayError(err);
        },
      });
    } catch (error) {
      // @ts-ignore
      this.displayError(error);
    }
  }

  build() {
    try {
      const selectedHardware = this.getSelectedHardware();

      this.deviceService.createDevice(selectedHardware).subscribe({
        next: (device: Device) => {
          this.controlCenterService.refreshDevices().subscribe(() => {
            this.router.navigate(['/device'], { queryParams: { device: device.uuid } }).then();
          });
          this.error = '';
          this.info = $localize`You successfully built a new device`;
        },
        error: (err: Error) => this.displayError(err),
      });
    } catch (error) {
      // @ts-ignore
      this.displayError(error);
    }
  }

  trackByControl(index: number, obj: { control: FormControl; props: ControlProperties }): FormControl {
    return obj.control;
  }
}

/**
 * Returns whether two arrays contain the same elements in the same order
 * @param a First array
 * @param b Second array
 */
function arraysEqual(a: any[], b: any[]) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null || a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function controlPropertiesEqual(a: ControlProperties, b: ControlProperties) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }

  return (
    arraysEqual(a.options, b.options) &&
    a.category === b.category &&
    a.description === b.description &&
    a.index === b.index
  );
}

interface Expansion extends Part {
  interface: [string /* name */, number /* version */];
}

interface ControlProperties {
  options: Part[];
  category: string;
  index: number;
  description?: string; // name of an expansion interface
}
