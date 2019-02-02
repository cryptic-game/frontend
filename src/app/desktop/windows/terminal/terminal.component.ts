import {Component, OnInit, Type} from '@angular/core';
import {WindowDelegate} from '../../window/window-delegate';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends WindowDelegate implements OnInit {

  title = 'Terminal';
  icon = 'assets/desktop/img/';
  type: Type<any> = TerminalComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
