import { Component, OnInit } from '@angular/core';
import { InventoryItemWithHardware } from '../../api/inventory/inventory-item';
import { ActivatedRoute } from '@angular/router';
import { PartCategory } from '../../api/hardware/hardware-parts';
import { InventoryService } from '../../api/inventory/inventory.service';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-control-center-inventory-page',
  templateUrl: './control-center-inventory-page.component.html',
  styleUrls: ['./control-center-inventory-page.component.scss']
})
export class ControlCenterInventoryPageComponent implements OnInit {
  items: InventoryItemWithHardware[] = [];
  tradeItem: InventoryItemWithHardware;

  partCategoryIcons = {
    [PartCategory.MAINBOARD]: 'mainboard',
    [PartCategory.CPU]: 'cpu',
    [PartCategory.PROCESSOR_COOLER]: 'processor_cooler',
    [PartCategory.GPU]: 'gpu',
    [PartCategory.RAM]: 'ram',
    [PartCategory.DISK]: 'disk',
    [PartCategory.POWER_PACK]: 'power_pack',
    [PartCategory.CASE]: 'case',
  };
  tradeErrorMessage = '';

  constructor(private activatedRoute: ActivatedRoute, private inventoryService: InventoryService, public apiService: WebsocketService) {
    activatedRoute.data.subscribe(data => {
      this.items = data['items'];
    });
  }

  ngOnInit(): void {
  }

  getCategoryIconName(partCategory: PartCategory): string {
    return this.partCategoryIcons[partCategory] + '.svg';
  }

  dragStart(event: DragEvent, item: InventoryItemWithHardware) {
    event.dataTransfer.setData('text/plain', item.element_uuid);
  }

  dragOver(event: DragEvent) {
    if (event.dataTransfer.types.length === 1 && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
    }
  }

  dragDrop(event: DragEvent) {
    event.preventDefault();
    const itemUUID = event.dataTransfer.getData('text/plain');
    this.tradeItem = this.items.find(item => item.element_uuid === itemUUID);
  }

  sendTradeItem(destination: HTMLInputElement) {
    this.inventoryService.sendItem(this.tradeItem.element_uuid, destination.value).subscribe(() => {
      this.tradeErrorMessage = '';
      this.tradeItem = null;
      this.inventoryService.getInventoryItemsWithHardware().subscribe(items => {
        this.items = items;
      });
    }, error => {
      if (error.message === 'item_not_found') {
        this.tradeErrorMessage = 'You do not own this item.';
        this.tradeItem = null;
      } else if (error.message === 'cannot_trade_with_yourself') {
        this.tradeErrorMessage = 'You cannot send this item to yourself.';
        destination.value = '';
      } else if (error.message === 'user_uuid_does_not_exist') {
        this.tradeErrorMessage = 'The specified UUID was not found.';
        destination.value = '';
      } else {
        this.tradeErrorMessage = error.message;
      }
    });
  }

}
