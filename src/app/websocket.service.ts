import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  public online = 0;
  private open = {};

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

  public ms(name, endpoint, data) {
    let tag = this.generateUUID();

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
      let tag = json['tag'];

      if(this.open[tag] != null) {
        this.open[tag].next(json['data']);
      }
    }
  }

}
