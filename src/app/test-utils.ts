import { NEVER, of, Subject } from 'rxjs';
import { WindowDelegate } from './desktop/window/window-delegate';
import { Device } from './api/devices/device';
import { WebsocketService } from './websocket.service';
import { WindowManager } from './desktop/window-manager/window-manager';

export function webSocketMock(): WebsocketService {
  const mock = jasmine.createSpyObj('WebsocketService', [
    'init',
    'close',
    'subscribeNotification',
    'request',
    'requestMany',
    'ms',
    'msPromise',
    'logout',
    'refreshAccountInfo',
    'trySession',
  ]);
  mock.init.and.returnValue(of().toPromise());
  mock.subscribeNotification.and.returnValue(new Subject());
  mock.request.and.returnValue(of());
  mock.requestMany.and.returnValue(NEVER);
  mock.ms.and.returnValue(of());
  mock.msPromise.and.returnValue(of().toPromise());
  mock.refreshAccountInfo.and.returnValue(of());
  mock.trySession.and.returnValue(of());
  mock.account = {
    uuid: '',
    name: '',
    created: 0,
    last: 0,
  };
  mock.loggedIn = false;
  mock.onlinePlayers = 0;

  return mock;
}

export function emptyDevice(partial: Partial<Device> = {}): Device {
  return { name: '', owner: '', powered_on: false, uuid: '', starter_device: false, ...partial };
}

export function emptyWindowDelegate(): WindowDelegate {
  return new (class extends WindowDelegate {
    icon = '';
    title = '';
    type: any = null; //TODO: Type me correct
    override device = emptyDevice();
  })();
}

export function windowManagerMock(): WindowManager {
  const mock = jasmine.createSpyObj('WindowManager', [
    'openWindow',
    'sortWindows',
    'closeWindow',
    'closeAllWindows',
    'focusWindow',
    'unfocus',
    'toggleMinimize',
  ]);
  mock.windows = [];
  mock.taskList = [];
  mock.activeWindow = emptyWindowDelegate();
  mock.device = emptyDevice();
  return mock;
}

export class FakePromise {
  private resolveCallback: (value: any) => any;
  private rejectCallback: (reason: any) => any;

  then(resolved: (value: any) => any, rejected: (reason: any) => any) {
    this.resolveCallback = resolved;
    this.rejectCallback = rejected;
  }

  catch(rejected: (reason: any) => any) {
    this.rejectCallback = rejected;
  }

  resolve(value: any) {
    this.resolveCallback?.(value);
  }

  reject(reason: any) {
    this.rejectCallback?.(reason);
  }
}
