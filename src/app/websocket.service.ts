import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { first } from 'rxjs/operators';

const URL: string = "ws://127.0.0.1:80/";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor() {
      this.socket = webSocket(URL);
      this.socket.next({
        "action": "status",
      });

      this.socket.subscribe(
            (message) => this.receive(message),
            (error) => console.error(error));
  }

  public send(json) {
    this.socket.next(json);
  }

  private receive(json) {
    console.log(json);
  }

  public request(json) {
    this.send(json);
    return this.socket.pipe(first());
  }

}

export const CLIENT: WebsocketService = new WebsocketService();
