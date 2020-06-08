import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { InventoryItemWithHardware } from '../../api/inventory/inventory-item';
import { Observable } from 'rxjs';
import { InventoryService } from '../../api/inventory/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class ControlCenterInventoryPageItemsResolver implements Resolve<InventoryItemWithHardware[]> {

  constructor(private inventoryService: InventoryService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InventoryItemWithHardware[]> {
    return this.inventoryService.getInventoryItemsWithHardware();
  }

}
