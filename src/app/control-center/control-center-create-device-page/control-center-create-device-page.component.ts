import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../api/devices/device.service';
import { InventoryService } from '../../api/inventory/inventory.service';
import { switchMap } from 'rxjs/operators';
import { HardwareService } from '../../api/hardware/hardware.service';
import { Case, CPU, Disk, Mainboard, PowerPack, ProcessorCooler, RAM } from '../../api/hardware/hardware-parts';
import { interval } from 'rxjs';

@Component({
  selector: 'app-control-center-create-device-page',
  templateUrl: './control-center-create-device-page.component.html',
  styleUrls: ['./control-center-create-device-page.component.scss']
})
export class ControlCenterCreateDevicePageComponent implements OnInit {

  form: FormGroup;
  info: string;
  error: string;

  mainBoards: Mainboard[] = [];
  cpus: CPU[] = [];
  extensions: { name: string, 'interface': [string /* name */, number /* version */] }[] = [];
  ramSticks: RAM[] = [];
  disks: Disk[] = [];
  processorCoolers: ProcessorCooler[] = [];
  powerSupplies: PowerPack[] = [];
  cases: Case[] = [];

  private oldMainboard: Mainboard;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly deviceService: DeviceService,
    private readonly hardwareService: HardwareService,
    private readonly inventoryService: InventoryService
  ) {
    this.form = this.formBuilder.group({
      cpus: this.formBuilder.array([]),
      extensions: this.formBuilder.array([]),
      mainboard: ['', Validators.required],
      ramSticks: this.formBuilder.array([]),
      disks: this.formBuilder.array([]),
      processorCoolers: this.formBuilder.array([]),
      powerSupply: ['', Validators.required],
      case: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(data => this.updateFields(data));
    this.inventoryService.update.subscribe(() => this.updateCache());
  }

  ngOnInit() {
    this.updateCache();
    interval(1000 * 10).subscribe(() => this.updateCache());
  }

  public updateCache(): any {
    this.hardwareService.updateParts()
      .pipe(switchMap(() => this.inventoryService.getInventoryItems()))
      .subscribe(items => {
        this.cpus = [];
        this.mainBoards = [];
        this.extensions = [];
        this.ramSticks = [];
        this.processorCoolers = [];
        this.disks = [];
        this.powerSupplies = [];
        this.cases = [];

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
            // @ts-ignore
            this.extensions.push(gpuElement);
          }
          const ramStickElement = this.hardwareService.hardwareAvailable.ram[item.element_name];
          if (ramStickElement) {
            this.ramSticks.push(ramStickElement);
          }
          const processorCoolerElement = this.hardwareService.hardwareAvailable.processorCooler[item.element_name];
          if (processorCoolerElement) {
            this.processorCoolers.push(processorCoolerElement);
          }
          const diskElement = this.hardwareService.hardwareAvailable.disk[item.element_name];
          if (diskElement) {
            console.log(diskElement.interface);
            // @ts-ignore
            (diskElement.interface[0] === 'SATA' ? this.disks : this.extensions).push(diskElement);
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

        this.updateFields(this.form.value);
      });
  }

  getCpus(): FormArray {
    return this.form.get('cpus') as FormArray;
  }

  getExtensions(): FormArray {
    return this.form.get('extensions') as FormArray;
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
      this.getExtensions().controls.map(control => control.value),
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

  private updateFields(data: any): void {
    const mainboard: Mainboard = this.hardwareService.hardwareAvailable.mainboard[data.mainboard] || this.mainBoards[0];
    if (!mainboard || mainboard === this.oldMainboard) {
      return;
    }
    this.form.get('mainboard').setValue(mainboard.name);
    this.oldMainboard = mainboard;

    this.getCpus().clear();
    this.getCpuCoolers().clear();
    for (let i = 0; i < mainboard.cpuSlots; i++) {
      this.getCpus().push(this.formBuilder.control(['', [Validators.required]]));
      this.getCpuCoolers().push(this.formBuilder.control(['', [Validators.required]]));
    }

    this.getExtensions().clear();
    let gpuCount = 0;
    mainboard.expansionSlots.map(item => item.interfaceSlots).forEach(i => gpuCount += i);
    for (let i = 0; i < gpuCount; i++) {
      this.getExtensions().push(this.formBuilder.control(['', [Validators.required]]));
    }

    this.getRamSticks().clear();
    for (let i = 0; i < mainboard.ram.ramSlots; i++) {
      this.getRamSticks().push(this.formBuilder.control(['', [Validators.required]]));
    }

    this.getDisks().clear();
    for (let i = 0; i < mainboard.diskStorage.diskSlots; i++) {
      this.getDisks().push(this.formBuilder.control(['', [Validators.required]]));
    }
  }
}
