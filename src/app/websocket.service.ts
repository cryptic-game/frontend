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

  private receive(json) {
    // for debug purpose
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

}

export const CLIENT: WebsocketService = new WebsocketService();
