import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-test-window',
  templateUrl: './test-window.component.html',
  styleUrls: ['./test-window.component.scss']
})
export class TestWindowComponent extends WindowComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}

export class TestWindowDelegate extends WindowDelegate {
  title = 'Testfenster';
  icon = 'assets/desktop/img/filemanager.svg';
  type: Type<any> = TestWindowComponent;
}
