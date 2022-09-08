import { Injectable } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { from, Observable } from 'rxjs';
import { InventoryItem, InventoryItemWithHardware } from './inventory-item';
import { filter, mergeMap, map, switchMap, toArray } from 'rxjs/operators';
import { HardwareService } from '../hardware/hardware.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private webSocket: WebsocketService, private hardwareService: HardwareService) {}

  getInventoryItems(): Observable<InventoryItem[]> {
    return this.webSocket.ms('inventory', ['inventory', 'list'], {}).pipe(map((response) => response['elements']));
  }

  /**
   * Possible errors:
   * - item_not_found
   * - cannot_trade_with_yourself
   * - user_uuid_does_not_exist
   * @param elementUUID UUID of the item to send to another player
   * @param destination UUID of the receiving player
   */
  sendItem(elementUUID: string, destination: string): Observable<{ ok: true }> {
    return this.webSocket.ms('inventory', ['inventory', 'trade'], { element_uuid: elementUUID, target: destination });
  }

  getInventoryItemsWithHardware(): Observable<InventoryItemWithHardware[]> {
    return this.hardwareService.getAvailableParts().pipe(
      mergeMap((hardware) => {
        return this.getInventoryItems().pipe(
          switchMap((items) => from(items)),
          filter((item) => {
            const valid = hardware!.getByName(item.element_name) != null;
            if (!valid) {
              console.warn('Invalid inventory item: ' + item.element_name);
            }
            return valid;
          }),
          map((item) => {
            return { ...item, properties: hardware!.getByName(item.element_name) };
          }),
          toArray(),
          map((items) => items.sort((a, b) => a.properties.category! - b.properties.category!))
        );
      })
    );
  }
}
