import { Component, OnDestroy } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  constructor(private websocket: WebsocketService) {
  }

  ngOnDestroy() {
    this.websocket.close();
  }
}
