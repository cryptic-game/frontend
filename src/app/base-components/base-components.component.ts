import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-base-components',
  templateUrl: './base-components.component.html',
  styleUrls: ['./base-components.component.scss']
})
export class BaseComponentsComponent {

  constructor() {
  }

  buttonStates = {
    default_switch: false,
    checked_switch: true,
    disabled_switch: false,
    disabled_checked_switch: true,
  }

  pressedAlert(name: string) {
    alert(name + " was pressed!");
  }
}
