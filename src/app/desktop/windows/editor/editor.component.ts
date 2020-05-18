import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends WindowComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}

export class EditorWindowDelegate extends WindowDelegate {
  title = 'Editor';
  icon = 'assets/desktop/img/editor.svg';
  type: Type<any> = EditorComponent;

  constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });
}
