import { inject, TestBed } from '@angular/core/testing';

import { DesktopGuard } from './desktop.guard';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Observable, of, throwError } from 'rxjs';
import { DeviceService } from '../api/devices/device.service';
import { DesktopDeviceService } from './desktop-device.service';

describe('DesktopGuard', () => {
  const accountUUID = '6bbc3608-780a-4a5f-bd4f-1ff0e513c8fb';
  const testDeviceUUID = 'ad744f90-0435-4617-91f3-443d7ba2b05a';
  let activatedRouteSnapshot;
  let router;
  let webSocketService;
  let deviceService;

  beforeEach(() => {
    activatedRouteSnapshot = { queryParamMap: jasmine.createSpyObj('ParamMap', ['get']) } as ActivatedRouteSnapshot;
    (activatedRouteSnapshot.queryParamMap.get as jasmine.Spy).and.returnValue(testDeviceUUID);
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(new Promise(resolve => resolve(true)));
    webSocketService = jasmine.createSpyObj('WebsocketService', ['trySession']);
    webSocketService.account = { uuid: accountUUID };
    deviceService = jasmine.createSpyObj('DeviceService', ['getDeviceInfo']);

    TestBed.configureTestingModule({
      providers: [
        DesktopGuard,
        DesktopDeviceService,
        { provide: Router, useValue: router },
        { provide: WebsocketService, useValue: webSocketService },
        { provide: DeviceService, useValue: deviceService },
      ]
    });
  });

  it('should be created', inject([DesktopGuard], (guard: DesktopGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should try to login, allow activation, and save the device to the service if it succeeded, the device is online, and the user owns the device',
    inject([DesktopGuard, DesktopDeviceService], (guard: DesktopGuard, desktopDeviceService: DesktopDeviceService) => {
      const testDevice = { powered_on: true, owner: accountUUID };
      webSocketService.trySession.and.returnValue(of(true));
      deviceService.getDeviceInfo.and.returnValue(of(testDevice));
      desktopDeviceService.activeDevice = null;


      const observable = guard.canActivate(activatedRouteSnapshot, null) as Observable<boolean>;
      observable.subscribe(canActivate => {
        expect(activatedRouteSnapshot.queryParamMap.get).toHaveBeenCalledWith('device');
        expect(deviceService.getDeviceInfo).toHaveBeenCalledWith(testDeviceUUID);
        expect(webSocketService.trySession).toHaveBeenCalled();
        expect(canActivate).toBeTrue();
        expect(desktopDeviceService.activeDevice).toEqual(testDevice);
        expect(router.navigate).not.toHaveBeenCalled();
      });
    }));

  function expectBackToControlCenter(guard) {
    const observable = guard.canActivate(activatedRouteSnapshot, null) as Observable<boolean>;
    observable.subscribe(canActivate => {
      expect(activatedRouteSnapshot.queryParamMap.get).toHaveBeenCalledWith('device');
      expect(deviceService.getDeviceInfo).toHaveBeenCalledWith(testDeviceUUID);
      expect(webSocketService.trySession).toHaveBeenCalled();
      expect(canActivate).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith([]);
    }, err => {
      fail('Expected a value but got an error: ' + err.message);
    });
  }

  it('should try to login and go back to the control center if it succeeded but the device is offline',
    inject([DesktopGuard], (guard: DesktopGuard) => {
      webSocketService.trySession.and.returnValue(of(true));
      deviceService.getDeviceInfo.and.returnValue(of({ powered_on: false, owner: accountUUID }));

      expectBackToControlCenter(guard);
    })
  );

  it('should try to login and go back to the control center if it succeeded but the user does not own the device',
    inject([DesktopGuard], (guard: DesktopGuard) => {
      webSocketService.trySession.and.returnValue(of(true));
      deviceService.getDeviceInfo.and.returnValue(of({ powered_on: false, owner: 'someone-else' }));

      expectBackToControlCenter(guard);
    })
  );

  it('should try to login and go back to the control center if it succeeded but the device does not exist',
    inject([DesktopGuard], (guard: DesktopGuard) => {
      webSocketService.trySession.and.returnValue(of(true));
      deviceService.getDeviceInfo.and.returnValue(throwError(new Error('device_not_found')));

      expectBackToControlCenter(guard);
    })
  );

  it('should try to login and navigate back to login if it failed', inject([DesktopGuard], (guard: DesktopGuard) => {
    webSocketService.trySession.and.returnValue(of(false));
    deviceService.getDeviceInfo.and.returnValue(of({ powered_on: true }));

    const observable = guard.canActivate(activatedRouteSnapshot, null) as Observable<boolean>;
    observable.subscribe(canActivate => {
      expect(webSocketService.trySession).toHaveBeenCalled();
      expect(canActivate).toBeFalsy();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  }));

});
