import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn = localStorage.getItem('token') !== null;

  loginDone() {
    this.loggedIn = true;
  }
}
