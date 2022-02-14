import {TestBed} from '@angular/core/testing';

import {DesktopDeviceResolver} from './desktop-device.resolver';
import {Observable, of, throwError} from 'rxjs';
import {DeviceService} from '../api/devices/device.service';
import {emptyDevice, webSocketMock} from '../test-utils';
import {Device} from '../api/devices/device';
import {Router} from '@angular/router';
import {WebsocketService} from '../websocket.service';

describe('DesktopDeviceResolver', () => {
  const accountUUID = '6bbc3608-780a-4a5f-bd4f-1ff0e513c8fb';
  const routeDeviceUUID = 'ad744f90-0435-4617-91f3-443d7ba2b05a';
  let activatedRouteSnapshot;
  let apiService;
  let deviceService;
  let resolver: DesktopDeviceResolver;
  let router;

  beforeEach(() => {
    activatedRouteSnapshot = {queryParamMap: jasmine.createSpyObj('ParamMap', ['get'])};
    (activatedRouteSnapshot.queryParamMap.get as jasmine.Spy).and.returnValue(routeDeviceUUID);
    apiService = webSocketMock();
    apiService.account = {uuid: accountUUID, name: '', created: 0, last: 0};
    deviceService = jasmine.createSpyObj('DeviceService', ['getDeviceInfo']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    router.navigateByUrl.and.returnValue(new Promise(resolve => resolve(true)));

    TestBed.configureTestingModule({
      providers: [
        {provide: DeviceService, useValue: deviceService},
        {provide: WebsocketService, useValue: apiService},
        {provide: Router, useValue: router}
      ]
    });
    resolver = TestBed.inject(DesktopDeviceResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return the device if it exists, is online, and the user owns the it', () => {
    const testDevice = emptyDevice({owner: accountUUID, uuid: routeDeviceUUID, powered_on: true});
    deviceService.getDeviceInfo.and.returnValue(of(testDevice));

    const observable = resolver.resolve(activatedRouteSnapshot, null) as Observable<Device>;
    let result: Device = null;
    observable.subscribe({
      next: (r: Device) => result = r,
      error: () => fail
    });
    expect(result).toEqual(testDevice);
    expect(activatedRouteSnapshot.queryParamMap.get).toHaveBeenCalledWith('device');
    expect(deviceService.getDeviceInfo).toHaveBeenCalledWith(routeDeviceUUID);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  function expectBackToControlCenter() {
    const observable = resolver.resolve(activatedRouteSnapshot, null) as Observable<Device>;
    let result: Device = null;
    observable.subscribe({
      next: (r: Device) => result = r,
      error: () => fail
    });

    expect(activatedRouteSnapshot.queryParamMap.get).toHaveBeenCalledWith('device');
    expect(deviceService.getDeviceInfo).toHaveBeenCalledWith(routeDeviceUUID);
    expect(result).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }

  it('should navigate back to the control center if the device does not exist', () => {
    deviceService.getDeviceInfo.and.returnValue(throwError(() => new Error('device_not_found')));
    expectBackToControlCenter();
  });

  it('should navigate back to the control center if the device is offline', () => {
    deviceService.getDeviceInfo.and.returnValue(of(emptyDevice({powered_on: false, owner: accountUUID})));
    expectBackToControlCenter();
  });

  it('should navigate back to the control center if the user doesn\'t own the device', () => {
    deviceService.getDeviceInfo.and.returnValue(of(emptyDevice({powered_on: false, owner: 'someone-else'})));
    expectBackToControlCenter();
  });
});
