import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor() {
    this.init();
  }

  public init() {
    this.socket = webSocket(environment.api);
    this.socket.subscribe(
      (message) => this.receive(message),
      (error) => console.error(error));
  }

  public send(json) {
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

  public ms(name, endpoint, data) {
    const payload = {
      'ms': name,
      'endpoint': endpoint,
      'data': data
    };

    return this.request(payload);
  }

  private receive(json) {
    // for debug purpose
  }

}
