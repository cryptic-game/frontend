import { Component, OnDestroy } from '@angular/core';
import { CLIENT } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  loggedIn = false;

  constructor() {
  }

  ngOnDestroy() {
    CLIENT.close();
  }
}
