import { TestBed } from '@angular/core/testing';

import { ControlCenterInventoryPageItemsResolver } from './control-center-inventory-page-items.resolver';
import { InventoryService } from '../../api/inventory/inventory.service';

describe('ControlCenterInventoryPageItemsResolver', () => {
  let service: ControlCenterInventoryPageItemsResolver;
  let inventoryService;

  beforeEach(() => {
    inventoryService = jasmine.createSpyObj('InventoryService', ['getInventoryItemsWithHardware']);

    TestBed.configureTestingModule({
      providers: [
        { provide: InventoryService, useValue: inventoryService }
      ]
    });
    service = TestBed.inject(ControlCenterInventoryPageItemsResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
