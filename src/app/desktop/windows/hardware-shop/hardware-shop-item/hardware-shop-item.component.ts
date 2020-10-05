import { Component, Input, OnInit } from '@angular/core';
import { HardwareShopService } from '../hardware-shop.service';
import { HardwareShopItem } from '../hardware-shop-item';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PartCategory, Mainboard, CPU, ProcessorCooler, RAM, GPU, Disk, PowerPack, Case } from '../../../../api/hardware/hardware-parts';

@Component({
  selector: 'app-hardware-shop-item',
  templateUrl: './hardware-shop-item.component.html',
  styleUrls: ['./hardware-shop-item.component.scss'],
  animations: [
    trigger('expandCollapse', [
      transition('void => *', [
        style({
          'opacity': '0',
          'transform': 'translateY(-100px)',
          'clip-path': 'inset(100px 0 0 0)'
        }),
        animate('200ms', style({
          'opacity': '1',
          'transform': 'translateY(0)',
          'clip-path': 'inset(0 0 0 0)'
        }))
      ]),
      transition('* => void', [
        style({
          'opacity': '1',
          'transform': 'translateY(0)',
          'clip-path': 'inset(0 0 0 0)'
        }),
        animate('200ms', style({
          'opacity': '0',
          'transform': 'translateY(-100px)',
          'clip-path': 'inset(100px 0 0 0)'
        }))
      ])
    ]),
    trigger('arrowUpwardsDownwards', [
      state('upwards', style({})),
      state('downwards', style({
        transform: 'rotateX(-180deg)'
      })),
      transition('upwards <=> downwards', [
        animate('200ms')
      ])
    ])
  ]
})
export class HardwareShopItemComponent implements OnInit {
  specifications: { [category: string]: { [property: string]: any } };
  specificationsVisible = false;

  private _item: HardwareShopItem;

  get item(): HardwareShopItem {
    return this._item;
  }

  @Input() set item(value: HardwareShopItem) {
    this._item = value;
    this.specifications = this.getSpecifications();
  }

  inCart = false;

  constructor(public hardwareShopService: HardwareShopService) {
    hardwareShopService.updateCartItems.subscribe(() =>
      this.inCart = this.hardwareShopService.cartContains(this.item)
    );
  }

  ngOnInit() {
    this.inCart = this.hardwareShopService.cartContains(this.item);
  }

  addToCart(): void {
    this.hardwareShopService.addCartItem(this.item);
  }

  removeFromCart(): void {
    this.hardwareShopService.removeCartItem(this.item);
  }

  originalOrder(): number {
    return 0;
  }

  private getSpecifications() {
    switch (this.item.part.category) {
      case PartCategory.MAINBOARD:
        const mainboard = this.item.part as Mainboard;

        const hasIDEDiskInterface = mainboard.diskStorage.interface.find(x => x[0] === 'IDE');
        const hasSATADiskInterface = mainboard.diskStorage.interface.find(x => x[0] === 'SATA');

        return {
          'Mainboard properties': {
            'Form factor': mainboard.case,
            'Power usage': `${mainboard.power} W`,
          },
          'Mainboard processor': {
            'Socket': `${mainboard.cpuSlots}x ${mainboard.cpuSocket}`,
            'Temperature control': mainboard.coreTemperatureControl ? 'yes' : 'no'
          },
          'Mainboard memory': {
            'Slots': mainboard.ram.ramSlots,
            'Maximum amount': `${mainboard.ram.maxRamSize} MB`,
            'Type': mainboard.ram.ramTyp.map(type => type.join(' ')).join(', '),
            'Frequencies': mainboard.ram.frequency.map(freq => `${freq} MHz`).join(', ')
          },
          'Mainboard graphics': {
            'Integrated graphics': mainboard.graphicUnitOnBoard?.name ?? 'no',
            'Memory': mainboard.graphicUnitOnBoard ? `${mainboard.graphicUnitOnBoard.ramSize} MB` : undefined,
            'Frequency': mainboard.graphicUnitOnBoard ? `${mainboard.graphicUnitOnBoard?.frequency} MHz` : undefined
          },
          'Expansion slots': mainboard.expansionSlots
            .reduce((acc, expansion) =>
              ({ ...acc, [expansion.interface.join(' ').concat('.0')]: `${expansion.interfaceSlots}x` }), {}),
          'Mainboard ports': {
            'IDE': hasIDEDiskInterface ? `${mainboard.diskStorage.diskSlots}x [${mainboard.diskStorage.interface.map(type => type.join(' ').concat('.0')).join(', ')}]  (internal)` : undefined,
            'SATA': hasSATADiskInterface ? `${mainboard.diskStorage.diskSlots}x [${mainboard.diskStorage.interface.map(type => type.join(' ').concat('.0')).join(', ')}] (internal)` : undefined,
            'USB': mainboard.usbPorts ? `${mainboard.usbPorts}x (external)` : undefined,
            'Ethernet': `1x (external)`
          },
          'Mainboard network': {
            'LAN controller': mainboard.networkPort.name,
            'Speed': `${mainboard.networkPort.speed} MBit/s`
          }
        };

      case PartCategory.CPU:
        const cpu = this.item.part as CPU;

        return {
          'Processor properties': {
            'Frequeny min': `${cpu.frequencyMin} MHz`,
            'Frequeny max': `${cpu.frequencyMax} MHz`,
            'Socket': cpu.socket,
            'Number cores': cpu.cores,
            'Max. temperature': `${cpu.maxTemperature} °C`,
            'Power usage': `${cpu.power} W`
          },
          'Processor specific power': {
            'Turbospeed': cpu.turboSpeed ? 'available' : 'not available',
            'Overclock': cpu.overClock ? 'available' : 'not available'
          },
          'Processor graphics': {
            'Integrated graphics': cpu.graphicUnit ? cpu.graphicUnit.name : 'not integrated',
            'Memory': cpu.graphicUnit ? `${cpu.graphicUnit.ramSize} MB` : undefined,
            'Frequency': cpu.graphicUnit ? `${cpu.graphicUnit.frequency} MHz` : undefined
          }
        };

      case PartCategory.PROCESSOR_COOLER:
        const processorCooler = this.item.part as ProcessorCooler;

        return {
          'Cooler properties': {
            'Cooler speed': processorCooler.coolerSpeed,
            'Socket': processorCooler.socket,
            'Power usage': `${processorCooler.power} W`
          }
        };

      case PartCategory.RAM:
        const ram = this.item.part as RAM;

        console.log(ram.ramTyp);

        return {
          'RAM properties': {
            'RAM size': `${ram.ramSize} MB`,
            'Type': ram.ramTyp.join(' '),
            'Frequency': `${ram.frequency} MHz`,
            'Power usage': `${ram.power} W`,
          }
        };

      case PartCategory.GPU:
        const gpu = this.item.part as GPU;

        return {
          'Graphic cards properties': {
            'RAM size': `${gpu.ramSize} MB`,
            'Type': gpu.ramTyp.join(' '),
            'Frequency': `${gpu.frequency} MHz`,
            'Interface': `${gpu.interface.join(' ')}.0`,
            'Power usage': `${gpu.power} W`
          }
        };

      case PartCategory.DISK:
        const disk = this.item.part as Disk;

        return {
          'Disk properties': {
            'Type': disk.diskTyp,
            'Capacity': `${disk.capacity / 1000} GB`,
            'Interface': `${disk.interface.join(' ')}.0`,
            'Writing speed': `${disk.writingSpeed} MB/s`,
            'Reading speed': `${disk.readingSpeed} MB/s`,
            'Power usage': `${disk.power} W`
          }
        };

      case PartCategory.POWER_PACK:
        const powerPack = this.item.part as PowerPack;

        return {
          'Powerpack properties': {
            'Total power': `${powerPack.totalPower} W`
          }
        };

      case PartCategory.CASE:
        const _case = this.item.part as Case;

        return {
          'Case properties': {
            'Name': _case.name,
            'Size': _case.size
          }
        };

      default:
        return {};
    }
  }


}
