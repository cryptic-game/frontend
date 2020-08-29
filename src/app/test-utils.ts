import { of, Subscription } from 'rxjs';

export function webSocketMock() {
  const mock = jasmine.createSpyObj(
    'WebsocketService',
    ['init', 'close', 'subscribe_notification', 'request', 'ms', 'msPromise', 'logout', 'refreshAccountInfo', 'trySession']
  );
  mock.subscribe_notification.and.returnValue(new Subscription());
  mock.request.and.returnValue(of());
  mock.ms.and.returnValue(of());
  mock.msPromise.and.returnValue(of().toPromise());
  mock.refreshAccountInfo.and.returnValue(of());
  mock.trySession.and.returnValue(of());
  mock.account = {
    uuid: '',
    name: '',
    created: 0,
    last: 0
  };
  mock.loggedIn = false;
  mock.onlinePlayers = 0;

  return mock;
}
