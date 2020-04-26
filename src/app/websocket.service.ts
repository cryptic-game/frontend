import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, first, flatMap, map } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { v4 as randomUUID } from 'uuid';
import { Account } from '../dataclasses/account';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  onlinePlayers = 0;
  account: Account = {
    uuid: '',
    name: '',
    mail: '',
    created: 0,
    last: 0
  };
  loggedIn = false;

  private socketSubject: WebSocketSubject<any>;
  private open = {};
  private notification_subjects: { [notify_id: string]: Subject<Notification> } = {};
  private connectedOnce = false;
  private keepAliveHandle: any;

  constructor() {
  }

  init() {
    // rxjs webSocket automatically reconnects when subscribed again, so no need to recreate
    if (!this.socketSubject) {
      this.socketSubject = webSocket({
        url: environment.api,
        openObserver: {
          next: () => {
            if (this.connectedOnce) {
              console.log('Reconnected to the server.');
              this.trySession().subscribe();
            } else {
              this.connectedOnce = true;
            }

            clearInterval(this.keepAliveHandle);
            this.keepAliveHandle = setInterval(() => {
              this.socketSubject.next({
                'action': 'info'
              });
            }, 1000 * 30);

          }
        },
        closeObserver: {
          next: (event) => {
            if (event.code !== 4000) {
              console.log('Lost connection to the server. Trying to reconnect in 10 seconds.');
              setTimeout(this.init.bind(this), 10000);
              clearInterval(this.keepAliveHandle);
              this.keepAliveHandle = null;
            }
            this.loggedIn = false;
          }
        }
      });
    }

    this.socketSubject.subscribe({
      next: this.handleMessage.bind(this),
      error: console.error
    });
  }

  close() {
    this.socketSubject.error({ code: 4000, reason: 'client-close' });
  }

  subscribe_notification(notify_id: string): Subject<Notification> {
    if (this.notification_subjects[notify_id] != null) {
      return this.notification_subjects[notify_id];
    }

    const subject = new Subject<Notification>();
    this.notification_subjects[notify_id] = subject;
    return subject;
  }

  request(data: object): Observable<any> {
    this.socketSubject.next(data);
    return this.socketSubject.pipe(first(), map(checkResponseError));  // this will soon get tags too
  }

  ms(name: string, endpoint: string[], data: object): Observable<any> {
    const tag = randomUUID();
    if (this.socketSubject.closed || this.socketSubject.hasError) {
      return throwError(new Error('socket-closed'));
    }

    this.socketSubject.next({
      'ms': name,
      'endpoint': endpoint,
      'data': data,
      'tag': tag,
    });

    return this.open[tag] = new Subject().pipe(map(checkResponseError));
  }

  msPromise(name: string, endpoint: string[], data: object): Promise<any> {
    return this.ms(name, endpoint, data).toPromise();
  }

  private handleMessage(message: object) {
    if (message['error'] != null) {
      this.open = {};
    } else if (message['tag'] != null && message['data'] != null) {
      const tag = message['tag'];

      if (this.open[tag] != null) {
        this.open[tag].next(message['data']);
        this.open[tag].complete();
        delete this.open[tag];
      }
    } else if (message['notify-id'] != null && message['data'] != null) {
      const subject = this.notification_subjects[message['notify-id']];

      if (subject != null) {
        subject.next({ data: message['data'], device_uuid: message['device_uuid'], origin: message['origin'] });
      }
    }
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.request({ action: 'logout' });
    this.loggedIn = false;
  }

  refreshAccountInfo(): Observable<Account> {
    return this.request({ action: 'info' }).pipe(map(data => {
      this.account.name = data['name'];
      this.account.uuid = data['uuid'];
      this.account.mail = data['mail'];
      this.account.created = data['created'];
      this.account.last = data['last'];
      this.onlinePlayers = data['online'];
      return this.account;
    }));
  }

  trySession(): Observable<boolean> {
    if (this.loggedIn) {
      return of(true);
    } else if (localStorage.getItem('token') == null) {
      return of(false);
    } else {
      return this.request({ action: 'session', token: localStorage.getItem('token') }).pipe(
        flatMap(() => this.refreshAccountInfo().pipe(map(() => {
          this.loggedIn = true;
          return true;
        }))),
        catchError(() => {
          localStorage.removeItem('token');
          return of(false);
        })
      );
    }
  }

}

function checkResponseError(obj) {
  if (obj['error']) {
    throw new Error(obj['error']);
  } else {
    return obj;
  }
}

export interface Notification {
  data: any;
  device_uuid?: string;
  origin?: string;
}
