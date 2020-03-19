import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  public online = 0;
  private open = {};
  private notification_subjects: { [notify_id: string]: Subject<Notification> } = {};

  constructor() {
    this.init();
  }

  public init() {
    this.socket = webSocket(environment.api);
    this.socket.subscribe(
      (message) => this.receive(message),
      (error) => console.error(error));

    setInterval(() => {
      this.send({
        'action': 'info'
      });
    }, 1000 * 30);
  }

  private send(json) {
    this.socket.next(json);
  }

  public request(json) {
    this.send(json);
    return this.socket.pipe(first());
  }

  public register_notification(notify_id: string): Subject<Notification> {
    if (this.notification_subjects[notify_id] != null) {
      return this.notification_subjects[notify_id];
    }

    const subject = new Subject<Notification>();
    this.notification_subjects[notify_id] = subject;
    return subject;
  }

  public close() {
    this.socket.complete();
  }

  public reconnect() {
    this.close();
    this.init();
  }

  private generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  public ms(name, endpoint, data): Subject<any> {
    const tag = this.generateUUID();

    const payload = {
      'ms': name,
      'endpoint': endpoint,
      'data': data,
      'tag': tag,
    };

    this.send(payload);

    this.open[tag] = new Subject();
    return this.open[tag];
  }

  private receive(json) {
    if (json['error'] != null) {
      this.open = {};
    } else if (json['online'] != null) {
      this.online = json['online'];
    } else if (json['tag'] != null && json['data'] != null) {
      const tag = json['tag'];

      if (this.open[tag] != null) {
        this.open[tag].next(json['data']);
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
