import { TestBed } from '@angular/core/testing';

import { ControlCenterInventoryPageItemsResolverService } from './control-center-inventory-page-items-resolver.service';
import { InventoryService } from '../../api/inventory/inventory.service';

describe('ControlCenterInventoryPageItemsResolverService', () => {
  let service: ControlCenterInventoryPageItemsResolverService;
  let inventoryService;

  beforeEach(() => {
    inventoryService = jasmine.createSpyObj('InventoryService', ['getInventoryItemsWithHardware']);

    TestBed.configureTestingModule({
      providers: [
        { provide: InventoryService, useValue: inventoryService }
      ]
    });
    service = TestBed.inject(ControlCenterInventoryPageItemsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
