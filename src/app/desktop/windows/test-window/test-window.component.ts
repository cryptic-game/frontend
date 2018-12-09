import {Component, OnInit, Type} from '@angular/core';
import {Window} from '../../window/window';

@Component({
  selector: 'app-test-window',
  templateUrl: './test-window.component.html',
  styleUrls: ['./test-window.component.scss']
})
export class TestWindowComponent extends Window implements OnInit {

  title = 'Testfenster';
  icon = 'assets/desktop/img/filemanager.svg';
  type: Type<any> = TestWindowComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
