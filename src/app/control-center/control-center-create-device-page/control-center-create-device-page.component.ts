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
  }

  getCpus(): FormArray {
    return this.form.get('cpus') as FormArray;
  }

  addCpu(): void {
    this.getCpus().push(this.formBuilder.control(['', [Validators.required]]));
  }

  getGpus(): FormArray {
    return this.form.get('gpus') as FormArray;
  }

  addGpu(): void {
    this.getGpus().push(this.formBuilder.control(['', [Validators.required]]));
  }

  getRamSticks(): FormArray {
    return this.form.get('ramSticks') as FormArray;
  }

  addRamStick(): void {
    this.getRamSticks().push(this.formBuilder.control(['', [Validators.required]]));
  }

  getDisks(): FormArray {
    return this.form.get('disks') as FormArray;
  }

  addDisk(): void {
    this.getDisks().push(this.formBuilder.control(['', [Validators.required]]));
  }

  getCpuCoolers(): FormArray {
    return this.form.get('processorCoolers') as FormArray;
  }

  addCpuCooler(): void {
    this.getCpuCoolers().push(this.formBuilder.control(['', [Validators.required]]));
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
    ).subscribe(data => console.log(data));
  }
}
