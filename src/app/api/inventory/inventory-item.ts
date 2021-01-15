import * as Parts from '../hardware/hardware-parts';

export interface InventoryItem {
  element_uuid: string;
  element_name: string;
  related_ms: string;
  owner: string;
}

export interface InventoryItemWithHardware extends InventoryItem {
  properties: Parts.Part;
}
