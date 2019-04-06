import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';

const URL: string = "wss://ws.cryptic-game.net/";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor() {
      this.socket = webSocket(URL);
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

}

export const CLIENT: WebsocketService = new WebsocketService();
