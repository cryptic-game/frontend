import { inject, TestBed } from '@angular/core/testing';

import { HardwareShopService } from './hardware-shop.service';
import { WebsocketService } from '../../../websocket.service';
import { webSocketMock } from '../../../test-utils';

describe('HardwareShopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }],
    });
  });

  it('should be created', inject([HardwareShopService], (service: HardwareShopService) => {
    expect(service).toBeTruthy();
  }));

  it('#getCartItems() should return "cart" as parsed JSON from localStorage',
    inject([HardwareShopService], (service: HardwareShopService) => {
      spyOn(localStorage, 'getItem').and.returnValue('testReturn');
      spyOn(JSON, 'parse').and.returnValue('testReturn2');

      expect(service.getCartItems()).toEqual('testReturn2' as any);
      expect(localStorage.getItem).toHaveBeenCalledWith('cart');
      expect(JSON.parse).toHaveBeenCalledWith('testReturn');
    })
  );

  it('#getCartItems() should return an empty array even though localStorage returns null',
    inject([HardwareShopService], (service: HardwareShopService) => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(JSON, 'parse').and.returnValue(null);

      expect(service.getCartItems()).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('cart');
      expect(JSON.parse).toHaveBeenCalledWith(null);
    })
  );

});
