import { Component } from '@angular/core';

@Component({
  selector: 'app-base-components',
  templateUrl: './base-components.component.html',
  styleUrls: ['./base-components.component.scss']
})
export class BaseComponentsComponent {

  constructor() { }

  pressedAlert(name: string) {
    alert(name + " was pressed!");
  }
}
