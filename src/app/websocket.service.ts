import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, first, map } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { v4 as randomUUID } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public onlinePlayers = 0;

  private socketSubject: WebSocketSubject<any>;
  private open = {};
  private notification_subjects: { [notify_id: string]: Subject<Notification> } = {};
  private connectedOnce = false;
  private keepAliveHandle: any;

  constructor() {
    this.init();
    console.log(this);
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

  reconnect() {
    this.close();
    this.init();
  }

  subscribe_notification(notify_id: string): Subject<Notification> {
    if (this.notification_subjects[notify_id] != null) {
      return this.notification_subjects[notify_id];
    }

    const subject = new Subject<Notification>();
    this.notification_subjects[notify_id] = subject;
    return subject;
  }

  request(json): Observable<any> {
    this.socketSubject.next(json);
    return this.socketSubject.pipe(first());  // this will soon get tags too
  }

  ms(name, endpoint, data): Observable<any> {
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

    return this.open[tag] = new Subject();
  }

  msPromise(name, endpoint, data): Promise<any> {
    return this.ms(name, endpoint, data).toPromise();
  }

  private handleMessage(json) {
    if (json['error'] != null) {
      this.open = {};
    } else if (json['online'] != null) {
      this.onlinePlayers = json['online'];
    } else if (json['tag'] != null && json['data'] != null) {
      const tag = json['tag'];

      if (this.open[tag] != null) {
        this.open[tag].next(json['data']);
        this.open[tag].complete();
        delete this.open[tag];
      }
    } else if (json['notify-id'] != null && json['data'] != null) {
      const subject = this.notification_subjects[json['notify-id']];

      if (subject != null) {
        subject.next({ data: json['data'], device_uuid: json['device_uuid'], origin: json['origin'] });
      }
    }
  }

}

export interface Notification {
  data: any;
  device_uuid?: string;
  origin?: string;
}
