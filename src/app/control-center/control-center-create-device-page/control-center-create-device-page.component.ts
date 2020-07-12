import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../api/devices/device.service';
import { InventoryService } from '../../api/inventory/inventory.service';
import { switchMap } from 'rxjs/operators';
import { HardwareService } from '../../api/hardware/hardware.service';
import { Case, CPU, Disk, GPU, Mainboard, PowerPack, ProcessorCooler, RAM } from '../../api/hardware/hardware-parts';

@Component({
  selector: 'app-control-center-create-device-page',
  templateUrl: './control-center-create-device-page.component.html',
  styleUrls: ['./control-center-create-device-page.component.scss']
})
export class ControlCenterCreateDevicePageComponent {

  form: FormGroup;
  info: string;
  error: string;

  mainBoards: Mainboard[] = [];
  cpus: CPU[] = [];
  gpus: GPU[] = [];
  ramSticks: RAM[] = [];
  disks: Disk[] = [];
  processorCoolers: ProcessorCooler[] = [];
  powerSupplies: PowerPack[] = [];
  cases: Case[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly deviceService: DeviceService,
    private readonly hardwareService: HardwareService,
    private readonly inventoryService: InventoryService
  ) {
    this.form = this.formBuilder.group({
      cpus: this.formBuilder.array([]),
      gpus: this.formBuilder.array([]),
      mainboard: ['', Validators.required],
      ramSticks: this.formBuilder.array([]),
      disks: this.formBuilder.array([]),
      processorCoolers: this.formBuilder.array([]),
      powerSupply: ['', Validators.required],
      case: ['', Validators.required],
    });

    this.hardwareService.updateParts()
      .pipe(switchMap(() => this.inventoryService.getInventoryItems()))
      .subscribe(items => {
        items.forEach(item => {
          const cpuElement = this.hardwareService.hardwareAvailable.cpu[item.element_name];
          if (cpuElement) {
            this.cpus.push(cpuElement);
          }
          const mainBoardElement = this.hardwareService.hardwareAvailable.mainboard[item.element_name];
          if (mainBoardElement) {
            this.mainBoards.push(mainBoardElement);
          }
          const gpuElement = this.hardwareService.hardwareAvailable.gpu[item.element_name];
          if (gpuElement) {
            this.gpus.push(gpuElement);
          }
          const ramStickElement = this.hardwareService.hardwareAvailable.ram[item.element_name];
          if (ramStickElement) {
            this.ramSticks.push(ramStickElement);
          }
          const processorCoolerElement = this.hardwareService.hardwareAvailable.processorCooler[item.element_name];
          if (processorCoolerElement) {
            this.processorCoolers.push(processorCoolerElement);
          }
          const powerSupplyElement = this.hardwareService.hardwareAvailable.powerPack[item.element_name];
          if (powerSupplyElement) {
            this.powerSupplies.push(powerSupplyElement);
          }
          const caseElement = this.hardwareService.hardwareAvailable.case[item.element_name];
          if (caseElement) {
            this.cases.push(caseElement);
          }
        });
      });

    let oldMainboard;

    this.form.valueChanges.subscribe(data => {

      const mainboard: Mainboard = this.hardwareService.hardwareAvailable.mainboard[data.mainboard];
      if (!mainboard || mainboard === oldMainboard) {
        return;
      }
      oldMainboard = mainboard;

      this.getCpus().clear();
      this.getCpuCoolers().clear();
      for (let i = 0; i < mainboard.cpuSlots; i++) {
        this.getCpus().push(this.formBuilder.control(['', [Validators.required]]));
        this.getCpuCoolers().push(this.formBuilder.control(['', [Validators.required]]));
      }

      this.getGpus().clear();
      let gpuCount = 0;
      mainboard.expansionSlots.map(item => item.interfaceSlots).forEach(i => gpuCount += i);
      for (let i = 0; i < gpuCount; i++) {
        this.getGpus().push(this.formBuilder.control(['', [Validators.required]]));
      }

      this.getRamSticks().clear();
      for (let i = 0; i < mainboard.ram.ramSlots; i++) {
        this.getRamSticks().push(this.formBuilder.control(['', [Validators.required]]));
      }

      this.getDisks().clear();
      for (let i = 0; i < mainboard.diskStorage.diskSlots; i++) {
        this.getDisks().push(this.formBuilder.control(['', [Validators.required]]));
      }
    });
  }

  getCpus(): FormArray {
    return this.form.get('cpus') as FormArray;
  }

  getGpus(): FormArray {
    return this.form.get('gpus') as FormArray;
  }

  getRamSticks(): FormArray {
    return this.form.get('ramSticks') as FormArray;
  }

  getDisks(): FormArray {
    return this.form.get('disks') as FormArray;
  }

  getCpuCoolers(): FormArray {
    return this.form.get('processorCoolers') as FormArray;
  }

  create(): void {
    this.deviceService.createDevice(
      this.getGpus().controls.map(control => control.value),
      this.getCpus().controls.map(control => control.value),
      this.form.get('mainboard').value,
      this.getRamSticks().controls.map(control => control.value),
      this.getDisks().controls.map(control => control.value),
      this.getCpuCoolers().controls.map(control => control.value),
      this.form.get('powerSupply').value,
      this.form.get('case').value
    ).subscribe(data => {
      this.info = 'Your device was successfully created.';
      setTimeout(() => this.info = undefined, 1000 * 10);
      this.form.reset();
    }, err => {
      this.error = 'You may have selected an element twice.';
      console.warn(`Error while creating device: ${err}`);
      setTimeout(() => this.error = undefined, 1000 * 10);
    });
  }
}
