import { Component, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent extends WindowComponent implements OnInit {

  delegate: IntroductionDelegate;
  page = 'Introduction';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

export class IntroductionDelegate extends WindowDelegate {
  title = 'Introduction';
  icon = 'assets/desktop/img/introduction-app.svg';
  type: Type<any> = IntroductionComponent;
}
