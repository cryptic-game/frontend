import { Component } from '@angular/core';
import { Observable, Subject } from "rxjs/Rx";
import { CLIENT } from "./websocket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn = false;

  constructor() {
  }

  ngOnDestroy() {
    CLIENT.close();
  }
}
