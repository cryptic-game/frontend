import {Component} from '@angular/core';
import {WindowComponent} from '../../window/window-delegate';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-test-window',
  templateUrl: './test-window.component.html',
  styleUrls: ['./test-window.component.scss']
})
export class TestWindowComponent extends WindowComponent {

  constructor() {
    super();
  }
}

