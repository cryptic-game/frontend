import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  public online = 0;

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

  public send(json) {
    this.socket.next(json);
  }

  public request(json): Observable<any> {
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

  public ms(name, endpoint, data) {
    const payload = {
      'ms': name,
      'endpoint': endpoint,
      'data': data
    };

    return this.request(payload);
  }

  private receive(json) {
    if (json['online'] != null) {
      this.online = json['online'];
    }
  }

}
